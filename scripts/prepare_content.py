#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / "adv-medical-com-hk-migration-source"
PUBLIC_ASSETS = ROOT / "public" / "assets"
DATA_DIR = ROOT / "src" / "data"
DIST_CONTENT = ROOT / "dist" / "content"
PUBLIC_CONTENT = ROOT / "public" / "content"
TMP = ROOT / ".tmp-assets"


IMG_RE = re.compile(r"<img[^>]+src=[\"']([^\"']+)[\"']", re.I)
VIDEO_RE = re.compile(r"<video[^>]+src=[\"']([^\"']+)[\"']", re.I)
SRC_RE = re.compile(r'(src|href)=["\']([^"\']+)["\']', re.I)
SRCSET_RE = re.compile(r'\s+srcset=["\'][^"\']+["\']', re.I)


def load_json(name: str):
    return json.loads((SOURCE / name).read_text("utf-8"))


def slugify(value: str) -> str:
    parsed = urllib.parse.urlparse(value)
    name = urllib.parse.unquote(Path(parsed.path).name)
    stem = Path(name).stem
    ext = Path(name).suffix.lower()
    stem = re.sub(r"[^A-Za-z0-9]+", "-", stem).strip("-").lower() or "asset"
    return stem[:90], ext


def choose_image_url(url: str, media_by_url: dict[str, dict]) -> str:
    media = media_by_url.get(url)
    if not media:
        return url
    sizes = (media.get("media_details") or {}).get("sizes") or {}
    for key in ("large", "medium_large", "woocommerce_single", "full"):
        source_url = (sizes.get(key) or {}).get("source_url")
        if source_url:
            return source_url
    return media.get("source_url") or url


def normalize_url(url: str) -> str:
    if url.startswith("//"):
        return "https:" + url
    if url.startswith("/"):
        return "https://adv-medical.com.hk" + url
    return url


def download(url: str, dest: Path) -> bool:
    dest.parent.mkdir(parents=True, exist_ok=True)
    parsed = urllib.parse.urlsplit(url)
    encoded_url = urllib.parse.urlunsplit(
        (
            parsed.scheme,
            parsed.netloc,
            urllib.parse.quote(urllib.parse.unquote(parsed.path), safe="/%:@"),
            urllib.parse.quote_plus(parsed.query, safe="=&%:,@/"),
            parsed.fragment,
        )
    )
    req = urllib.request.Request(
        encoded_url,
        headers={
            "User-Agent": "Mozilla/5.0 ADV migration",
            "Accept": "*/*",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as response:
            dest.write_bytes(response.read())
        return True
    except Exception as exc:
        print(f"warn: failed to download {url}: {exc}", file=sys.stderr)
        return False


def convert_image(source: Path, dest: Path) -> bool:
    cwebp = shutil.which("cwebp") or "/opt/homebrew/bin/cwebp"
    if not Path(cwebp).exists():
        shutil.copy2(source, dest)
        return True
    result = subprocess.run(
        [cwebp, "-quiet", "-q", "78", str(source), "-o", str(dest)],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    if result.returncode != 0:
        print(f"warn: cwebp failed for {source.name}: {result.stderr.strip()}", file=sys.stderr)
        return False
    return True


def convert_video(source: Path, dest: Path) -> bool:
    ffmpeg = shutil.which("ffmpeg") or "/opt/homebrew/bin/ffmpeg"
    if not Path(ffmpeg).exists():
        shutil.copy2(source, dest)
        return True
    result = subprocess.run(
        [
            ffmpeg,
            "-y",
            "-i",
            str(source),
            "-vf",
            "scale='min(1280,iw)':-2",
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "30",
            "-c:a",
            "aac",
            "-b:a",
            "96k",
            str(dest),
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    if result.returncode != 0:
        print(f"warn: ffmpeg failed for {source.name}: {result.stderr[-400:]}", file=sys.stderr)
        return False
    return True


def register_asset_mapping(
    asset_map: dict[str, str],
    media_by_url: dict[str, dict],
    source_url: str,
    picked_url: str,
    local: str,
) -> None:
    for value in (source_url, picked_url):
        asset_map[value] = local
    media = media_by_url.get(source_url) or media_by_url.get(picked_url)
    if not media:
        return
    original = media.get("source_url")
    if original:
        asset_map[normalize_url(original)] = local
    sizes = (media.get("media_details") or {}).get("sizes") or {}
    for size in sizes.values():
        sized_url = size.get("source_url")
        if sized_url:
            asset_map[normalize_url(sized_url)] = local


def localize_href(value: str) -> str:
    normalized = normalize_url(value)
    parsed = urllib.parse.urlparse(normalized)
    if parsed.scheme not in {"http", "https"}:
        return value
    if parsed.netloc not in {"adv-medical.com.hk", "ita.xib.mybluehost.me"}:
        return "#"
    path = parsed.path.replace("/website_9e883b19", "", 1)
    if path.startswith(("/product/", "/product-category/", "/cart/", "/checkout/")):
        return "#"
    if not path or path == "/":
        return "/"
    return path if path.endswith("/") else f"{path}/"


def clean_html(markup: str, asset_map: dict[str, str]) -> str:
    markup = re.sub(r"<script[\s\S]*?</script>", "", markup, flags=re.I)
    markup = re.sub(r"<style[\s\S]*?</style>", "", markup, flags=re.I)
    markup = re.sub(r"<iframe[\s\S]*?</iframe>", "", markup, flags=re.I)
    markup = re.sub(r"<link\b[^>]*>", "", markup, flags=re.I)
    markup = re.sub(r"<noscript[\s\S]*?</noscript>", "", markup, flags=re.I)
    markup = re.sub(r'\s+data-[A-Za-z0-9_:-]+=(["\']).*?\1', "", markup, flags=re.I | re.S)
    markup = SRCSET_RE.sub("", markup)

    def replace_attr(match: re.Match[str]) -> str:
        attr, value = match.group(1), html.unescape(match.group(2))
        if attr.lower() == "href":
            return f'href="{html.escape(localize_href(value), quote=True)}"'
        local = asset_map.get(normalize_url(value), value)
        local = asset_map.get(value, local)
        if attr.lower() == "src" and local.startswith(("http://", "https://", "//")):
            return f'data-removed-src="{html.escape(local, quote=True)}"'
        return f'{attr}="{local}"'

    markup = SRC_RE.sub(replace_attr, markup)
    markup = re.sub(r'\s+sizes=["\'][^"\']+["\']', "", markup, flags=re.I)
    markup = re.sub(r'\s+loading=["\'][^"\']+["\']', "", markup, flags=re.I)
    markup = re.sub(r'\s+decoding=["\'][^"\']+["\']', "", markup, flags=re.I)
    markup = re.sub(r'\s+preload=["\'][^"\']+["\']', "", markup, flags=re.I)
    markup = re.sub(r"<img\b", '<img loading="lazy" decoding="async"', markup, flags=re.I)
    markup = re.sub(r"<video\b", '<video preload="none"', markup, flags=re.I)
    return html.unescape(markup)


def text_excerpt(markup: str, fallback: str = "") -> str:
    text = re.sub(r"<[^>]+>", " ", markup)
    text = html.unescape(re.sub(r"\s+", " ", text)).strip()
    return (text or fallback)[:190]


def post_path(post: dict) -> str:
    parts = post["date"].split("T", 1)[0].split("-")
    return f"/{parts[0]}/{parts[1]}/{parts[2]}/{post['slug']}/"


def main() -> int:
    pages = load_json("pages.json")
    posts = load_json("posts.json")
    media = load_json("media.json") + load_json("media-2.json")

    PUBLIC_ASSETS.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)

    media_by_url = {}
    for item in media:
        source = item.get("source_url")
        if source:
            media_by_url[source] = item
        sizes = (item.get("media_details") or {}).get("sizes") or {}
        for size in sizes.values():
            source = size.get("source_url")
            if source:
                media_by_url[source] = item

    raw_urls: list[str] = []
    for entity in pages + posts:
        markup = entity.get("content", {}).get("rendered", "")
        raw_urls.extend(m.group(1) for m in IMG_RE.finditer(markup))
        raw_urls.extend(m.group(1) for m in VIDEO_RE.finditer(markup))
        featured = entity.get("uagb_featured_image_src", {}).get("large")
        if featured and featured[0]:
            raw_urls.append(featured[0])

    assets = []
    asset_map: dict[str, str] = {}
    seen: set[str] = set()
    for raw in raw_urls:
        url = normalize_url(html.unescape(raw))
        picked = normalize_url(choose_image_url(url, media_by_url))
        if picked in seen or not picked.startswith("http"):
            continue
        seen.add(picked)
        stem, ext = slugify(picked)
        is_video = ext in {".mp4", ".mov", ".m4v", ".webm"}
        tmp_name = f"{len(assets)+1:03d}-{stem}{ext or ('.mp4' if is_video else '.img')}"
        tmp_path = TMP / tmp_name
        out_name = f"{len(assets)+1:03d}-{stem}.mp4" if is_video else f"{len(assets)+1:03d}-{stem}.webp"
        out_path = PUBLIC_ASSETS / out_name
        if out_path.exists():
            local = f"/assets/{out_name}"
            kind = "video" if is_video else "image"
            register_asset_mapping(asset_map, media_by_url, url, picked, local)
            assets.append({"source": picked, "local": local, "kind": kind})
            continue
        if not download(picked, tmp_path):
            continue
        if is_video:
            if not convert_video(tmp_path, out_path):
                shutil.copy2(tmp_path, out_path)
            local = f"/assets/{out_name}"
            kind = "video"
        else:
            if not convert_image(tmp_path, out_path):
                out_name = tmp_name
                out_path = PUBLIC_ASSETS / out_name
                shutil.copy2(tmp_path, out_path)
            local = f"/assets/{out_name}"
            kind = "image"
        register_asset_mapping(asset_map, media_by_url, url, picked, local)
        assets.append({"source": picked, "local": local, "kind": kind})

    post_records = []
    for post in posts:
        markup = post.get("content", {}).get("rendered", "")
        featured = None
        featured_src = post.get("uagb_featured_image_src", {}).get("large")
        if featured_src and featured_src[0]:
            featured = asset_map.get(normalize_url(featured_src[0]))
        post_records.append(
            {
                "id": post["id"],
                "slug": post["slug"],
                "path": post_path(post),
                "date": post["date"].split("T", 1)[0],
                "title": html.unescape(post["title"]["rendered"]),
                "excerpt": text_excerpt(post.get("excerpt", {}).get("rendered", ""), text_excerpt(markup)),
                "html": clean_html(markup, asset_map),
                "featuredImage": featured,
            }
        )

    page_records = []
    for page in pages:
        slug = page["slug"]
        path = "/" if slug == "home-free-2" else f"/{slug}/"
        if slug.startswith("home-free"):
            kind = "home-variant"
        elif slug == "checkout-2":
            kind = "commerce-placeholder"
        elif slug in {"home", "blog"}:
            kind = "index"
        else:
            kind = "page"
        page_records.append(
            {
                "id": page["id"],
                "slug": slug,
                "title": html.unescape(page["title"]["rendered"]),
                "path": path,
                "kind": kind,
                "html": clean_html(page.get("content", {}).get("rendered", ""), asset_map),
            }
        )

    content = {"pages": page_records, "posts": post_records, "assets": assets}
    site_index = {
        "pages": [{key: page[key] for key in ("id", "slug", "title", "path", "kind")} for page in page_records],
        "posts": [
            {key: post[key] for key in ("id", "slug", "path", "date", "title", "excerpt", "featuredImage")}
            for post in post_records
        ],
    }

    (DATA_DIR / "siteContent.json").write_text(json.dumps(content, ensure_ascii=False, indent=2), "utf-8")
    PUBLIC_CONTENT.mkdir(parents=True, exist_ok=True)
    (PUBLIC_CONTENT / "site-index.json").write_text(json.dumps(site_index, ensure_ascii=False), "utf-8")
    (PUBLIC_CONTENT / "site-content.json").write_text(json.dumps(content, ensure_ascii=False), "utf-8")
    pages_dir = PUBLIC_CONTENT / "pages"
    posts_dir = PUBLIC_CONTENT / "posts"
    pages_dir.mkdir(parents=True, exist_ok=True)
    posts_dir.mkdir(parents=True, exist_ok=True)
    for page in page_records:
        (pages_dir / f"{page['slug']}.json").write_text(json.dumps(page, ensure_ascii=False), "utf-8")
    for post in post_records:
        (posts_dir / f"{post['slug']}.json").write_text(json.dumps(post, ensure_ascii=False), "utf-8")

    DIST_CONTENT.mkdir(parents=True, exist_ok=True)
    (DIST_CONTENT / "site-index.json").write_text(json.dumps(site_index, ensure_ascii=False), "utf-8")
    (DIST_CONTENT / "site-content.json").write_text(json.dumps(content, ensure_ascii=False), "utf-8")
    (DIST_CONTENT / "pages").mkdir(parents=True, exist_ok=True)
    (DIST_CONTENT / "posts").mkdir(parents=True, exist_ok=True)
    for page in page_records:
        (DIST_CONTENT / "pages" / f"{page['slug']}.json").write_text(json.dumps(page, ensure_ascii=False), "utf-8")
    for post in post_records:
        (DIST_CONTENT / "posts" / f"{post['slug']}.json").write_text(json.dumps(post, ensure_ascii=False), "utf-8")
    print(f"prepared {len(page_records)} pages, {len(post_records)} posts, {len(assets)} assets")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
