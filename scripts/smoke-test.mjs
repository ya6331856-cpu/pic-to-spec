import { spawn } from "node:child_process";

const port = 3100;
const base = `http://127.0.0.1:${port}`;
const canonicalRoutes = [
  "/", "/about", "/privacy", "/terms",
  "/age-calculator", "/ats-resume-checker", "/background-remover",
  "/base64-encoder-decoder", "/case-converter", "/compress-image-to-50kb",
  "/csv-json-converter", "/json-to-csv-converter", "/json-to-excel-converter", "/discount-calculator", "/emi-calculator",
  "/formrule-ai", "/gst-calculator", "/gst-invoice-generator",
  "/hinglish-to-hindi", "/image-compressor", "/image-converter",
  "/image-cropper", "/image-resizer", "/image-to-text", "/jpg-to-pdf",
  "/jpg-to-webp", "/json-formatter", "/passport-photo-maker",
  "/password-generator", "/pdf-merger", "/pdf-organizer", "/pdf-splitter",
  "/pdf-to-excel", "/pdf-to-jpg", "/pdf-to-word", "/percentage-calculator",
  "/qr-code-generator", "/html-entity-encoder-decoder", "/unix-timestamp-converter",
  "/url-slug-generator", "/lorem-ipsum-generator", "/text-line-sorter",
  "/duplicate-line-remover", "/text-line-reverser", "/color-converter", "/url-parser", "/resize-photo-for-online-form",
  "/signature-resizer", "/unit-converter", "/url-encoder-decoder",
  "/json-to-xml-converter", "/xml-formatter", "/css-formatter", "/html-formatter",
  "/regex-tester", "/css-gradient-generator", "/json-validator", "/markdown-preview",
  "/meta-tag-generator", "/robots-txt-generator", "/json-schema-generator", "/json-to-typescript", "/sql-formatter", "/cron-expression-generator", "/javascript-minifier", "/html-minifier", "/css-minifier", "/json-to-yaml-converter", "/yaml-validator", "/xml-to-json-converter", "/sql-to-json-converter", "/json-diff", "/html-to-markdown-converter", "/xml-to-csv-converter",
  "/uuid-generator", "/word-counter", "/text-compare", "/csv-cleaner"
];
const legacyRedirects = [{ from: "/image-cutter", to: "/image-cropper" }];

const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", String(port)], { stdio: "ignore" });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function request(path, options = {}) {
  return fetch(base + path, { signal: AbortSignal.timeout(10000), ...options });
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      const response = await request("/");
      if (response.ok) { ready = true; break; }
    } catch {}
    await sleep(500);
  }
  if (!ready) throw new Error("Production server did not become ready.");

  for (const path of canonicalRoutes) {
    const response = await request(path);
    if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
    const html = await response.text();
    if (!html.includes("<title>") || !html.includes("PicToSpec")) {
      throw new Error(`${path} is missing its page title or brand content.`);
    }
    process.stdout.write(`PASS page ${path}\n`);
  }

  for (const route of legacyRedirects) {
    const response = await request(route.from, { redirect: "manual" });
    const location = response.headers.get("location") || "";
    if (![301, 302, 307, 308].includes(response.status) || !location.endsWith(route.to)) {
      throw new Error(`${route.from} did not redirect to ${route.to} (HTTP ${response.status}, Location: ${location}).`);
    }
    process.stdout.write(`PASS redirect ${route.from} -> ${route.to}\n`);
  }

  const sitemapResponse = await request("/sitemap.xml");
  if (!sitemapResponse.ok) throw new Error("sitemap.xml did not return HTTP 200.");
  const sitemap = await sitemapResponse.text();
  for (const path of canonicalRoutes) {
    const expected = `https://pictospec.com${path === "/" ? "" : path}`;
    if (!sitemap.includes(expected)) throw new Error(`Sitemap is missing canonical route ${path}`);
  }
  for (const route of legacyRedirects) {
    if (sitemap.includes(`https://pictospec.com${route.from}`)) {
      throw new Error(`Redirect-only route ${route.from} must not appear in the sitemap.`);
    }
  }

  const robotsResponse = await request("/robots.txt");
  if (!robotsResponse.ok || !(await robotsResponse.text()).includes("sitemap.xml")) {
    throw new Error("robots.txt is missing the sitemap reference.");
  }
  process.stdout.write(`\nSmoke test passed: ${canonicalRoutes.length} canonical pages, ${legacyRedirects.length} redirect, sitemap and robots.txt.\n`);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  server.kill("SIGTERM");
}
