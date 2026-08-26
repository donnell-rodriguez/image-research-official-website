import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const filedSiteName = "东莞优数医疗大数据有限公司";
const canonicalOrigin = "https://www.adv-medicare.com";
const icpRecordNumber = "粤ICP备2026092521号-1";
const icpRecordUrl = "https://beian.miit.gov.cn/";
const systemLoginUrl = "https://system.adv-medicare.com/login.html";
const contactEmail = "yunfanxiang@adv-medicare.com";
const copyrightNotice = "© 2026 Advantage Data Vision（东莞优数医疗大数据有限公司）. 版权所有。";
const forbiddenPublicMetadata = [
  "yunfanxiang@adv-medical.com.hk",
  "Copyright © 2026 Adv Inc. All rights reserved.",
  "© 2026 ADV MEDICARE LIMITED. All Rights Reserved."
];

function collectHtmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectHtmlFiles(entryPath);
    return entry.isFile() && entry.name.endsWith(".html") ? [entryPath] : [];
  });
}

function collectPublicArtifactFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectPublicArtifactFiles(entryPath);
    return entry.isFile() && /\.(?:html|js|json)$/u.test(entry.name) ? [entryPath] : [];
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
const deploymentConfig = fs.readFileSync(path.resolve("deploy/Caddyfile.production"), "utf8");
const publicArtifactText = collectPublicArtifactFiles(distDir)
  .map((file) => fs.readFileSync(file, "utf8"))
  .join("\n");

if (!robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`)) failures.push("robots.txt sitemap origin mismatch");
if (sitemap.includes("https://adv-medical.com.hk")) failures.push("sitemap.xml contains the old canonical origin");
if (!sitemap.includes(`<loc>${canonicalOrigin}/</loc>`)) failures.push("sitemap.xml is missing the canonical homepage");
if (!siteLayout.includes("footer-icp-record")) failures.push("Footer does not render the ICP record link");
if (!siteData.includes(icpRecordNumber) || !siteData.includes(icpRecordUrl)) failures.push("ICP filing metadata is incomplete");
if (!siteData.includes(systemLoginUrl)) failures.push("System Login footer destination is missing");
if (!siteData.includes(contactEmail) || !siteData.includes(copyrightNotice)) failures.push("Public contact or copyright metadata is incomplete");
if (!deploymentConfig.includes(`email ${contactEmail}`)) failures.push("Caddy certificate contact email is outdated");

for (const forbidden of forbiddenPublicMetadata) {
  if (publicArtifactText.includes(forbidden)) failures.push(`Built public artifacts contain outdated metadata: ${forbidden}`);
}
if (!publicArtifactText.includes(contactEmail)) failures.push("Built public artifacts are missing the current contact email");
if (!publicArtifactText.includes(copyrightNotice)) failures.push("Built public artifacts are missing the current copyright notice");

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Deployment metadata audit passed for ${htmlFiles.length} HTML files.`);
