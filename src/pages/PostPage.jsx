import { Link, useParams } from "@tanstack/react-router";
import { Icon, SocialIcon } from "../components/Icon";
import { LoadingPage, NotFound } from "../components/SystemPages";
import { siteImages, siteUrl } from "../data/site";
import { usePost, usePosts } from "../hooks/useContent";
import { useSeo } from "../hooks/useSeo";
import { formatDate } from "../lib/date";
import { getArticleInlineImageAlt, getPostImageAlt } from "../lib/imageAlt";

const NEWS_LIMIT = 14;

function getLabel(index) {
  if (index === 3) return "Quick Read";
  if ([4, 5, 10, 11, 12, 13].includes(index)) return "Press Release";
  return "Update";
}

function normalizeUrl(value = "") {
  return String(value || "").replace(/^https?:\/\/[^/]+/i, "");
}

function prepareArticleHtml(post) {
  const html = post?.html || "";
  const featuredImage = post?.featuredImage;
  if (typeof DOMParser === "undefined") return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstElementChild;
  const featuredSrc = normalizeUrl(featuredImage);
  const firstImage = root?.querySelector("img");

  if (featuredSrc && firstImage && normalizeUrl(firstImage.getAttribute("src") || "") === featuredSrc) {
    const removable = firstImage.closest("figure") || firstImage.parentElement || firstImage;
    removable.remove();
  }

  root?.querySelectorAll("img").forEach((image, index) => {
    image.setAttribute("loading", "lazy");
    image.setAttribute("decoding", "async");
    if (!image.getAttribute("alt")?.trim()) {
      image.setAttribute("alt", getArticleInlineImageAlt(post, index));
    }
  });

  return root?.innerHTML || html;
}

function ShareLinks({ post, compact = false }) {
  const articleUrl = `${siteUrl}${post.path}`;
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(post.title);

  return (
    <div className={compact ? "article-share article-share-compact" : "article-share"} aria-label="Share article">
      {!compact && <h2>Share article</h2>}
      <nav>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer" aria-label="Share on Facebook">
          <SocialIcon name="facebook" />
        </a>
        <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noreferrer" aria-label="Share on X">
          <SocialIcon name="x" />
        </a>
        <a href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`} aria-label="Share by email">
          <Icon name="mail" size={18} />
        </a>
        <a href={post.path} aria-label="Article link">
          <Icon name="link" size={18} />
        </a>
      </nav>
    </div>
  );
}

function ArticleLeadImage({ post }) {
  const src = post.featuredImage || siteImages.logo;

  return (
    <figure className={post.featuredImage ? "article-lead-media" : "article-lead-media article-lead-logo"}>
      <img src={src} alt={getPostImageAlt(post)} fetchPriority="high" decoding="async" />
    </figure>
  );
}

function RelatedArticle({ post, index }) {
  return (
    <Link to={post.path} className="article-related-item">
      <div className={post.featuredImage ? "article-related-image" : "article-related-image article-related-logo"}>
        <img
          src={post.featuredImage || siteImages.logo}
          alt={getPostImageAlt(post)}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div>
        <p className="newsroom-label">{getLabel(index)}</p>
        <h3>{post.title}</h3>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </div>
    </Link>
  );
}

function NewsroomCta() {
  return (
    <section className="article-newsroom-cta" aria-label="ADV Newsroom">
      <h2>
        <img src={siteImages.logo} alt="Advantage Data Vision logo" loading="lazy" decoding="async" />
        Newsroom
      </h2>
      <p>The latest news and updates, direct from ADV.</p>
      <Link to="/newsroom/">Read more</Link>
    </section>
  );
}

export function PostPage() {
  const params = useParams({ strict: false });
  const { data: post, isLoading } = usePost(params.slug);
  const { data: posts } = usePosts();
  useSeo({
    title: post?.title || "Newsroom",
    description: post?.excerpt || "Read the latest Advantage Data Vision newsroom update.",
    path: post?.path || `/${params.slug || ""}`,
    image: post?.featuredImage || siteImages.hero,
    type: "article",
  });

  if (isLoading) return <LoadingPage />;
  if (!post) return <NotFound />;

  const latestPosts = posts.slice(0, NEWS_LIMIT);
  const currentIndex = latestPosts.findIndex((item) => item.slug === post.slug);
  const relatedPosts = currentIndex >= 0 ? latestPosts.slice(currentIndex + 1, currentIndex + 4) : [];
  const labelIndex = currentIndex >= 0 ? currentIndex : 0;
  const cleanedHtml = prepareArticleHtml(post);

  return (
    <article className="newsroom-article-page">
      <header className="article-head">
        <p className="newsroom-label">{getLabel(labelIndex)}</p>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <h1>{post.title}</h1>
        <ShareLinks post={post} compact />
      </header>

      <ArticleLeadImage post={post} />

      <div className="article-body rich-content" dangerouslySetInnerHTML={{ __html: cleanedHtml }} />

      <ShareLinks post={post} />

      {relatedPosts.length > 0 && (
        <section className="article-related" aria-label="More from ADV Newsroom">
          <h2>More from ADV Newsroom</h2>
          <div>
            {relatedPosts.map((relatedPost, index) => (
              <RelatedArticle
                key={relatedPost.id}
                post={relatedPost}
                index={currentIndex + index + 1}
              />
            ))}
          </div>
        </section>
      )}

      <NewsroomCta />
    </article>
  );
}
