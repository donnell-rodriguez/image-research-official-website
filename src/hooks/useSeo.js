import React from "react";
import { siteImages, siteTagline, siteUrl } from "../data/site";

const defaultTitle = "Advantage Data Vision";
const defaultDescription =
  "Advantage Data Vision builds AI-powered healthcare decision-support systems for precision oncology, virtual patient simulation, and real-world data search.";

function absoluteUrl(value = "/") {
  if (/^https?:\/\//i.test(value)) return value;
  const path = value.startsWith("/") ? value : `/${value}`;
  return `${siteUrl}${path}`;
}

function normalizeTitle(title) {
  if (!title) return defaultTitle;
  return title.includes("Advantage Data Vision") ? title : `${title} | Advantage Data Vision`;
}

function normalizeDescription(description) {
  return String(description || siteTagline || defaultDescription).replace(/\s+/g, " ").trim();
}

function upsertMeta(selector, attrs) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

export function useSeo({ title, description, path = "/", image = siteImages.hero, type = "website" }) {
  React.useEffect(() => {
    const pageTitle = normalizeTitle(title);
    const pageDescription = normalizeDescription(description);
    const canonicalUrl = absoluteUrl(path);
    const imageUrl = absoluteUrl(image || siteImages.hero);

    document.title = pageTitle;
    upsertMeta('meta[name="description"]', { name: "description", content: pageDescription });
    upsertLink("canonical", canonicalUrl);

    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: defaultTitle });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: pageTitle });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: pageDescription });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: imageUrl });

    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: pageTitle });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: pageDescription });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: imageUrl });
  }, [description, image, path, title, type]);
}

export { absoluteUrl };
