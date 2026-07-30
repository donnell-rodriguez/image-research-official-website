import fs from "node:fs";
import path from "node:path";

const siteUrl = "https://adv-medical.com.hk";
const distDir = path.resolve("dist");
const indexFile = path.join(distDir, "index.html");
const siteIndexFile = path.resolve("public/content/site-index.json");
const defaultImage = "/assets/017-2-1024x615.webp";
const defaultDescription =
  "Advantage Data Vision builds AI-powered healthcare decision-support systems for precision oncology.";

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function titleWithBrand(title) {
  if (!title) return "Advantage Data Vision";
  return title.includes("Advantage Data Vision") ? title : `${title} | Advantage Data Vision`;
}

function normalizePath(value) {
  if (!value || value === "/") return "/";
  return value.startsWith("/") ? value : `/${value}`;
}

function absoluteUrl(value) {
  if (!value) return `${siteUrl}${defaultImage}`;
  if (/^https?:\/\//i.test(value)) return value;
  return `${siteUrl}${value.startsWith("/") ? value : `/${value}`}`;
}

function setTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function renderSeoHtml(baseHtml, page) {
  const title = escapeHtml(titleWithBrand(page.title));
  const description = escapeHtml(page.description || defaultDescription);
  const canonical = escapeHtml(`${siteUrl}${normalizePath(page.path)}`);
  const image = escapeHtml(absoluteUrl(page.image || defaultImage));
  const type = page.type || "website";

  let html = baseHtml.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  html = setTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`);
  html = setTag(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`);
  html = setTag(html, /<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${type}" />`);
  html = setTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`);
  html = setTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`);
  html = setTag(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`);
  html = setTag(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${image}" />`);
  html = setTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`);
  html = setTag(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${description}" />`);
  html = setTag(html, /<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${image}" />`);
  return html;
}

function outputPathForRoute(routePath) {
  const normalized = normalizePath(routePath);
  if (normalized === "/") return indexFile;
  const cleanPath = normalized.replace(/^\/+|\/+$/g, "");
  return path.join(distDir, cleanPath, "index.html");
}

const baseHtml = fs.readFileSync(indexFile, "utf8");
const siteIndex = JSON.parse(fs.readFileSync(siteIndexFile, "utf8"));

const pages = [
  {
    path: "/",
    title: "AI Healthcare Decision Support",
    description:
      "Advantage Data Vision develops virtual patient simulation, personalized deep features, and real-world data search systems for precision oncology workflows.",
  },
  {
    path: "/about-us/",
    title: "About ADV",
    description:
      "Learn about Advantage Data Vision, a PolyU-incubated medical AI company translating healthcare data into clinical decision support systems.",
    image: "/assets/040-20250520173247-1024x683.webp",
  },
  {
    path: "/contact/",
    title: "Contact ADV",
    description:
      "Contact Advantage Data Vision for product enquiries, clinical collaboration, partnerships, publications, and healthcare AI discussions.",
    image: "/assets/contact-map-polyu.webp",
  },
  {
    path: "/career",
    title: "Careers",
    description:
      "Explore engineering opportunities at Advantage Data Vision for medical AI, deep learning, clinical decision support, and healthcare product development.",
  },
  {
    path: "/products/virtual-patient-simulation-systems",
    title: "Virtual Patient Simulation System",
    description:
      "ADV Medicare Limited provides a virtual patient simulation system for precision oncology, personalized deep features, QR-based exchange, and real-world case search.",
    image: "/assets/018-20241217164407-768x390.webp",
  },
  {
    path: "/newsroom/",
    title: "Newsroom",
    description:
      "Read Advantage Data Vision news, product updates, medical AI events, clinical validation milestones, awards, and partnership announcements.",
  },
  {
    path: "/publications",
    title: "Granted Patents",
    description:
      "Explore Advantage Data Vision granted patents and research updates supporting medical AI, precision oncology, and secure clinical data exchange.",
  },
  {
    path: "/privacy-policy/",
    title: "Privacy Policy",
    description: "Read the Advantage Data Vision privacy policy for website visitors and business enquiries.",
  },
  {
    path: "/terms-of-use/",
    title: "Terms of Use",
    description: "Review the Advantage Data Vision website terms of use.",
  },
  {
    path: "/legal/",
    title: "Legal",
    description: "Review legal information for Advantage Data Vision website visitors and partners.",
  },
  {
    path: "/site-map/",
    title: "Site Map",
    description: "Browse the Advantage Data Vision website sitemap and key routes.",
  },
  ...siteIndex.posts
    .filter((post) => post.path !== "/publications")
    .map((post) => ({
      path: post.path,
      title: post.title,
      description: post.excerpt || defaultDescription,
      image: post.featuredImage || defaultImage,
      type: "article",
    })),
];

for (const page of pages) {
  const outputFile = outputPathForRoute(page.path);
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, renderSeoHtml(baseHtml, page));
}

console.log(`Generated SEO HTML for ${pages.length} routes.`);
