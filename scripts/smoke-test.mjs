import { spawn } from "node:child_process";

const port = 3100;
const base = `http://127.0.0.1:${port}`;
const routes = [
  "/", "/image-compressor", "/image-resizer", "/image-cropper", "/image-cutter",
  "/image-converter", "/compress-image-to-50kb", "/resize-photo-for-online-form",
  "/signature-resizer", "/jpg-to-webp", "/pdf-merger", "/pdf-splitter", "/jpg-to-pdf",
  "/gst-calculator", "/emi-calculator", "/percentage-calculator", "/discount-calculator",
  "/age-calculator", "/word-counter", "/case-converter", "/json-formatter",
  "/base64-encoder-decoder", "/password-generator", "/qr-code-generator", "/privacy"
];

const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", String(port)], { stdio: "ignore" });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function request(path) {
  return fetch(base + path, { signal: AbortSignal.timeout(5000) });
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

  for (const path of routes) {
    const response = await request(path);
    if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
    const html = await response.text();
    if (!html.includes("<title>") || !html.includes("PicToSpec")) {
      throw new Error(`${path} is missing its page title or brand content.`);
    }
    if (path !== "/privacy" && !html.includes("tool-search")) {
      throw new Error(`${path} is missing the global tool search.`);
    }
    process.stdout.write(`PASS ${path}\n`);
  }

  const sitemapResponse = await request("/sitemap.xml");
  if (!sitemapResponse.ok) throw new Error("sitemap.xml did not return HTTP 200.");
  const sitemap = await sitemapResponse.text();
  for (const path of routes) {
    const expected = path === "/" ? "https://pictospec.com/" : `https://pictospec.com${path}`;
    if (!sitemap.includes(expected)) throw new Error(`Sitemap is missing ${path}`);
  }

  const robotsResponse = await request("/robots.txt");
  if (!robotsResponse.ok || !(await robotsResponse.text()).includes("sitemap.xml")) {
    throw new Error("robots.txt is missing the sitemap reference.");
  }
  process.stdout.write(`\nSmoke test passed: ${routes.length} pages, sitemap and robots.txt.\n`);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  server.kill("SIGTERM");
}
