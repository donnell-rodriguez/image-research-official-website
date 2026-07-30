import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const stalePageSlugs = [
  "about-us",
  "adv-medicare-limited",
  "blog",
  "checkout-2",
  "contact",
  "home",
  "home-free-1",
  "home-free-2",
  "home-free-3",
  "home-free-4",
];
const maxPublicVideoBytes = 5_500_000;
const maxResponsiveOverrideLines = 1_000;
const issues = [];

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function walkFiles(target, files = []) {
  if (!fs.existsSync(target)) return files;
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    if ([".git", "node_modules"].includes(path.basename(target))) return files;
    for (const entry of fs.readdirSync(target)) {
      walkFiles(path.join(target, entry), files);
    }
    return files;
  }
  files.push(target);
  return files;
}

function rel(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function byteSize(file) {
  return fs.statSync(file).size;
}

function countLines(file) {
  return fs.readFileSync(path.join(root, file), "utf8").split("\n").length;
}

function assertNoGif(directory) {
  const absolute = path.join(root, directory);
  const gifs = walkFiles(absolute).filter((file) => path.extname(file).toLowerCase() === ".gif");
  for (const gif of gifs) issues.push(`GIF should not be deployed: ${rel(gif)}`);
}

function assertNoStalePages(directory) {
  const absolute = path.join(root, directory);
  for (const slug of stalePageSlugs) {
    const file = path.join(absolute, `${slug}.json`);
    if (fs.existsSync(file)) issues.push(`stale imported page should not be deployed: ${rel(file)}`);
  }
}

function assertPreloadBudget(file) {
  if (!exists(file)) return;
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const highPriorityImages = html.match(/<link\b[^>]*rel=["']preload["'][^>]*as=["']image["'][^>]*fetchpriority=["']high["'][^>]*>/gi) || [];
  if (highPriorityImages.length > 1) {
    issues.push(`${file} has ${highPriorityImages.length} high-priority image preloads; keep only the LCP image`);
  }
}

function assertHeaders() {
  const file = "public/_headers";
  if (!exists(file)) {
    issues.push("public/_headers is missing production cache rules");
    return;
  }

  const headers = fs.readFileSync(path.join(root, file), "utf8");
  const required = [
    /\/assets\/index-\*\.js[\s\S]*?immutable/i,
    /\/assets\/index-\*\.css[\s\S]*?immutable/i,
    /\/assets\/\*\.mp4[\s\S]*?max-age=2592000/i,
    /\/content\/\*[\s\S]*?must-revalidate/i,
    /\*\.html[\s\S]*?no-cache/i,
  ];

  for (const pattern of required) {
    if (!pattern.test(headers)) issues.push(`public/_headers is missing rule matching ${pattern}`);
  }
}

function assertNginxCacheSnippet() {
  const file = "docs/nginx-static-cache.conf";
  if (!exists(file)) {
    issues.push("docs/nginx-static-cache.conf is missing nginx cache/compression guidance");
    return;
  }

  const config = fs.readFileSync(path.join(root, file), "utf8");
  const required = [
    /gzip\s+on;/i,
    /\/assets\/index-\.\*[\s\S]*?immutable/i,
    /\/assets\/fonts\/[\s\S]*?immutable/i,
    /\/assets\/\.\*[\s\S]*?max-age=2592000/i,
    /\/content\/[\s\S]*?must-revalidate/i,
    /try_files\s+\$uri\s+\$uri\/\s+\/index\.html;/i,
  ];

  for (const pattern of required) {
    if (!pattern.test(config)) issues.push(`${file} is missing rule matching ${pattern}`);
  }
}

function assertHtaccess() {
  const file = "public/.htaccess";
  if (!exists(file)) {
    issues.push("public/.htaccess is missing Bluehost/Apache routing and cache rules");
    return;
  }

  const config = fs.readFileSync(path.join(root, file), "utf8");
  const required = [
    /Options\s+-MultiViews/i,
    /RewriteEngine\s+On/i,
    /RewriteRule\s+\^\s+index\.html\s+\[L\]/i,
    /Cache-Control\s+"public,\s*max-age=31536000,\s*immutable"/i,
    /Cache-Control\s+"public,\s*max-age=300,\s*must-revalidate"/i,
    /AddOutputFilterByType\s+DEFLATE/i,
  ];

  for (const pattern of required) {
    if (!pattern.test(config)) issues.push(`${file} is missing rule matching ${pattern}`);
  }
}

function assertVideoBudget() {
  const videos = walkFiles(path.join(root, "public/assets")).filter((file) => path.extname(file).toLowerCase() === ".mp4");
  const total = videos.reduce((sum, file) => sum + byteSize(file), 0);
  if (total > maxPublicVideoBytes) {
    issues.push(`public MP4 total is ${total} bytes; budget is ${maxPublicVideoBytes}`);
  }
}

function assertCssMaintainability() {
  const file = "src/styles/06-responsive-overrides.css";
  if (!exists(file)) return;
  const lines = countLines(file);
  if (lines > maxResponsiveOverrideLines) {
    issues.push(`${file} has ${lines} lines; keep module overrides split out`);
  }
}

assertNoGif("public");
assertNoGif("dist");
assertNoStalePages("public/content/pages");
assertNoStalePages("dist/content/pages");
assertPreloadBudget("index.html");
assertPreloadBudget("dist/index.html");
assertHeaders();
assertNginxCacheSnippet();
assertHtaccess();
assertVideoBudget();
assertCssMaintainability();

if (issues.length > 0) {
  console.log(`Performance audit failed with ${issues.length} issue(s):`);
  issues.forEach((issue) => console.log(`- ${issue}`));
  process.exit(1);
}

console.log("Performance audit passed.");
