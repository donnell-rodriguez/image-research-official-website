import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicRoot = path.join(root, "public");
const assetRoot = path.join(publicRoot, "assets");
const scanRoots = [
  "src",
  "public/content",
  "index.html",
  "scripts",
  "package.json",
  "vite.config.js",
  "public/robots.txt",
  "public/sitemap.xml",
];
const textExtensions = new Set([
  ".cjs",
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".py",
  ".ts",
  ".tsx",
  ".txt",
  ".xml",
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

function isTextFile(file) {
  return textExtensions.has(path.extname(file).toLowerCase()) || path.basename(file) === "index.html";
}

function publicAssetPath(file) {
  return `/${path.relative(publicRoot, file).split(path.sep).join("/")}`;
}

function normalizeAssetRef(value) {
  return value
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/\\/g, "")
    .replace(/&quot;.*$/i, "")
    .replace(/[?#].*$/, "")
    .replace(/[\"'`),;<>\\]}]+$/g, "");
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

function collectReferencedAssets() {
  const refs = new Set();
  const files = scanRoots.flatMap((entry) => walkFiles(path.join(root, entry), isTextFile));
  const assetPattern = /(?:https?:\/\/[^\s"')<>\\]+)?\/assets\/[^\s"')<>\\]+/g;

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8").replace(/\\\//g, "/");
    for (const match of text.matchAll(assetPattern)) {
      refs.add(normalizeAssetRef(match[0]));
    }
  }

  return refs;
}

function collectPublicAssets() {
  if (!fs.existsSync(assetRoot)) return [];

  return walkFiles(assetRoot, () => true).map((file) => ({
    path: publicAssetPath(file),
    size: fs.statSync(file).size,
  }));
}

const referencedAssets = collectReferencedAssets();
const publicAssets = collectPublicAssets();
const unusedAssets = publicAssets
  .filter((asset) => !referencedAssets.has(asset.path))
  .sort((a, b) => b.size - a.size);
const totalSize = publicAssets.reduce((sum, asset) => sum + asset.size, 0);
const unusedSize = unusedAssets.reduce((sum, asset) => sum + asset.size, 0);

console.log(
  [
    `Asset files: ${publicAssets.length}`,
    `Referenced: ${publicAssets.length - unusedAssets.length}`,
    `Unused: ${unusedAssets.length}`,
    `Total size: ${formatBytes(totalSize)}`,
    `Unused size: ${formatBytes(unusedSize)}`,
  ].join("\n"),
);

if (unusedAssets.length > 0) {
  console.log("\nUnused assets:");
  for (const asset of unusedAssets) {
    console.log(`${formatBytes(asset.size).padStart(9)}  ${asset.path}`);
  }
  process.exitCode = 1;
}
