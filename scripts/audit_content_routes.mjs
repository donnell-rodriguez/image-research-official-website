import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const stalePageSlugs = [
  "about-us",
  "contact",
  "home-free-1",
  "home-free-2",
  "home-free-3",
  "home-free-4",
  "checkout-2",
  "blog",
  "adv-medicare-limited",
];
const stalePaths = [
  "/home-free-1",
  "/home-free-2",
  "/home-free-3",
  "/home-free-4",
  "/checkout-2",
];
const placeholderPatterns = [
  /href=(["'])#\1/i,
  /href=(["'])#(?:download|pricing|shop)\1/i,
  /Lorem ipsum/i,
  /your@domain\.com/i,
  /New York/i,
];
const allowedPlaceholderFiles = new Set([
  "src/pages/AboutPage.jsx",
]);

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
}

function walkTextFiles(target, files = []) {
  if (!fs.existsSync(target)) return files;
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    if ([".git", "dist", "node_modules"].includes(path.basename(target))) return files;
    for (const entry of fs.readdirSync(target)) {
      walkTextFiles(path.join(target, entry), files);
    }
    return files;
  }

  if ([".json", ".js", ".jsx", ".ts", ".tsx", ".html", ".xml", ".txt"].includes(path.extname(target))) {
    files.push(target);
  }
  return files;
}

function rel(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

const issues = [];

for (const slug of stalePageSlugs) {
  const file = path.join(root, "public/content/pages", `${slug}.json`);
  if (fs.existsSync(file)) {
    issues.push(`stale imported page still exists: public/content/pages/${slug}.json`);
  }
}

const siteIndex = readJson("public/content/site-index.json");
const indexedPages = siteIndex.pages || [];
for (const page of indexedPages) {
  if (stalePageSlugs.includes(page.slug)) {
    issues.push(`stale page slug is still in site-index.json: ${page.slug}`);
  }
  if (stalePaths.some((stalePath) => page.path === stalePath || page.path === `${stalePath}/`)) {
    issues.push(`stale page path is still in site-index.json: ${page.path}`);
  }
}

for (const file of walkTextFiles(path.join(root, "public/content"))) {
  const text = fs.readFileSync(file, "utf8");
  for (const pattern of placeholderPatterns) {
    if (pattern.test(text)) {
      issues.push(`placeholder content matched ${pattern} in ${rel(file)}`);
    }
  }
}

for (const file of walkTextFiles(path.join(root, "src"))) {
  const relative = rel(file);
  if (allowedPlaceholderFiles.has(relative)) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const pattern of placeholderPatterns) {
    if (pattern.test(text)) {
      issues.push(`placeholder content matched ${pattern} in ${relative}`);
    }
  }
}

for (const stalePath of stalePaths) {
  const routerText = fs.readFileSync(path.join(root, "src/router.jsx"), "utf8");
  if (!routerText.includes(`path: "${stalePath}/"`) || !routerText.includes(`path: "${stalePath}"`)) {
    issues.push(`missing explicit stale-route redirect for ${stalePath} and ${stalePath}/`);
  }
}

if (issues.length > 0) {
  console.log(`Content route audit failed with ${issues.length} issue(s):`);
  issues.forEach((issue) => console.log(`- ${issue}`));
  process.exit(1);
}

console.log("Content route audit passed.");
