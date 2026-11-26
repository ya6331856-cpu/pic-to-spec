import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const appDir = path.join(root, "app");
const sitemapFile = path.join(appDir, "sitemap.ts");
const robotsFile = path.join(appDir, "robots.ts");

function walkPages(dir, relative = "") {
  const pages = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_") || entry.name === "api") continue;
    const absolute = path.join(dir, entry.name);
    const rel = path.join(relative, entry.name);
    if (entry.isDirectory()) {
      pages.push(...walkPages(absolute, rel));
    } else if (entry.isFile() && entry.name === "page.tsx") {
      const route = relative ? "/" + relative.split(path.sep).join("/") : "/";
      // Dynamic routes need deliberate canonical URL generation, not guessed paths.
      if (!route.split("/").some((part) => part.startsWith("[") && part.endsWith("]"))) {
        pages.push(route);
      }
    }
  }
  return pages;
}

const errors = [];
if (!fs.existsSync(sitemapFile)) errors.push("Missing app/sitemap.ts");
if (!fs.existsSync(robotsFile)) errors.push("Missing app/robots.ts");

if (errors.length === 0) {
  const sitemap = fs.readFileSync(sitemapFile, "utf8");
  const robots = fs.readFileSync(robotsFile, "utf8");
  const baseMatch = sitemap.match(/const\s+base\s*=\s*["'](https?:\/\/[^"']+)["']/);
  if (!baseMatch) {
    errors.push("Sitemap must define an absolute HTTPS base URL.");
  } else {
    const base = baseMatch[1].replace(/\/$/, "");
    if (base !== "https://pictospec.com") {
      errors.push(\`Unexpected sitemap host: \${base}\`);
    }
    const routeMatches = [...sitemap.matchAll(/["'](\/[a-z0-9-]+)["']/gi)].map((m) => m[1]);
    const declared = new Set(["/", ...routeMatches]);
    const actual = new Set(walkPages(appDir));
    for (const route of actual) {
      if (!declared.has(route)) errors.push(\`Page missing from sitemap: \${route}\`);
    }
    for (const route of declared) {
      if (route === "/") continue;
      if (!actual.has(route)) errors.push(\`Sitemap points to a page that does not exist: \${route}\`);
    }
    if (new Set(routeMatches).size !== routeMatches.length) {
      errors.push("Sitemap contains duplicate route entries.");
    }
  }
  if (!/userAgent:\s*["']\*["']/.test(robots) || !/allow:\s*["']\//.test(robots)) {
    errors.push("robots.ts must allow crawling for the general user-agent.");
  }
  if (!/sitemap:\s*["']https:\/\/pictospec\.com\/sitemap\.xml["']/.test(robots)) {
    errors.push("robots.ts must advertise the canonical sitemap.xml URL.");
  }
}

if (errors.length) {
  console.error("\nSEO crawl-readiness check failed:");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}

console.log("SEO crawl-readiness check passed: sitemap routes match public pages and robots.txt allows crawling.");
