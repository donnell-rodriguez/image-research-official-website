import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const filedSiteName = "东莞优数医疗大数据有限公司";
const canonicalOrigin = "https://www.adv-medicare.com";
const icpRecordNumber = "粤ICP备2026092521号-1";
const icpRecordUrl = "https://beian.miit.gov.cn/";
const systemLoginUrl = "https://system.adv-medicare.com/login.html";

function collectHtmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectHtmlFiles(entryPath);
    return entry.isFile() && entry.name.endsWith(".html") ? [entryPath] : [];
  });
}

const failures = [];
const htmlFiles = collectHtmlFiles(distDir);

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/s)?.[1];
  if (title !== filedSiteName) failures.push(`${file}: unexpected title ${JSON.stringify(title)}`);
  if (!canonical?.startsWith(canonicalOrigin)) {
    failures.push(`${file}: unexpected canonical ${JSON.stringify(canonical)}`);
  }
}

const robots = fs.readFileSync(path.join(distDir, "robots.txt"), "utf8");
const sitemap = fs.readFileSync(path.join(distDir, "sitemap.xml"), "utf8");
const siteLayout = fs.readFileSync(path.resolve("src/components/SiteLayout.jsx"), "utf8");
const siteData = fs.readFileSync(path.resolve("src/data/site.js"), "utf8");

if (!robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`)) failures.push("robots.txt sitemap origin mismatch");
if (sitemap.includes("https://adv-medical.com.hk")) failures.push("sitemap.xml contains the old canonical origin");
if (!sitemap.includes(`<loc>${canonicalOrigin}/</loc>`)) failures.push("sitemap.xml is missing the canonical homepage");
if (!siteLayout.includes("footer-icp-record")) failures.push("Footer does not render the ICP record link");
if (!siteData.includes(icpRecordNumber) || !siteData.includes(icpRecordUrl)) failures.push("ICP filing metadata is incomplete");
if (!siteData.includes(systemLoginUrl)) failures.push("System Login footer destination is missing");

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Deployment metadata audit passed for ${htmlFiles.length} HTML files.`);
