import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentRoots = ["public/content", "src/data/siteContent.json"];
const sourceRoots = ["src"];
const sourceExtensions = new Set([".js", ".jsx", ".ts", ".tsx"]);
const allowedEmptyAlt = new Set([
  "src/pages/home/HeroSection.jsx",
]);

function walkFiles(target, includeFile, files = []) {
  if (!fs.existsSync(target)) return files;
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    if ([".git", "dist", "node_modules"].includes(path.basename(target))) return files;
    for (const entry of fs.readdirSync(target)) {
      walkFiles(path.join(target, entry), includeFile, files);
    }
    return files;
  }
  if (includeFile(target)) files.push(target);
  return files;
}

function relativePath(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function getLine(text, index) {
  return text.slice(0, index).split("\n").length;
}

function scanHtmlImages(html, label, issues) {
  if (typeof html !== "string") return;

  const imagePattern = /<img\b[^>]*>/gi;
  const altPattern = /\salt\s*=\s*(['"])(.*?)\1/i;
  for (const match of html.matchAll(imagePattern)) {
    const tag = match[0];
    const altMatch = tag.match(altPattern);
    if (!altMatch || !altMatch[2].trim()) {
      issues.push(`${label}: image is missing meaningful alt text`);
    }
  }
}

function scanContentFile(file, issues) {
  const raw = fs.readFileSync(file, "utf8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return;
  }

  const scanItem = (item, fallbackLabel) => {
    if (!item || typeof item !== "object") return;
    const label = `${relativePath(file)}:${item.slug || item.title || fallbackLabel}`;
    scanHtmlImages(item.html, label, issues);
  };

  scanItem(data, "record");
  if (Array.isArray(data.pages)) data.pages.forEach((page) => scanItem(page, "page"));
  if (Array.isArray(data.posts)) data.posts.forEach((post) => scanItem(post, "post"));
}

function scanSourceFile(file, issues) {
  const rel = relativePath(file);
  if (allowedEmptyAlt.has(rel)) return;

  const text = fs.readFileSync(file, "utf8");
  const emptyAltPattern = /alt\s*=\s*(?:""|{["']["']})/g;
  for (const match of text.matchAll(emptyAltPattern)) {
    issues.push(`${rel}:${getLine(text, match.index)} uses empty alt outside an approved decorative image`);
  }
}

const issues = [];
for (const entry of contentRoots) {
  const absolute = path.join(root, entry);
  const files = walkFiles(absolute, (file) => path.extname(file).toLowerCase() === ".json");
  files.forEach((file) => scanContentFile(file, issues));
}

for (const entry of sourceRoots) {
  const absolute = path.join(root, entry);
  const files = walkFiles(absolute, (file) => sourceExtensions.has(path.extname(file).toLowerCase()));
  files.forEach((file) => scanSourceFile(file, issues));
}

if (issues.length > 0) {
  console.log(`Image alt audit failed with ${issues.length} issue(s):`);
  issues.forEach((issue) => console.log(`- ${issue}`));
  process.exit(1);
}

console.log("Image alt audit passed.");
