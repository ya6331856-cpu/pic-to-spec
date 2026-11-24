import type { MetadataRoute } from "next";

const base = "https://pictospec.com";

const tools = [
  "/compress-image-to-50kb", "/resize-photo-for-online-form", "/signature-resizer",
  "/jpg-to-webp", "/image-compressor", "/image-resizer", "/image-cropper", "/image-converter",
  "/gst-calculator", "/emi-calculator", "/percentage-calculator", "/discount-calculator", "/age-calculator",
  "/word-counter", "/text-compare", "/html-entity-encoder-decoder", "/unix-timestamp-converter", "/url-slug-generator", "/lorem-ipsum-generator", "/text-line-sorter", "/duplicate-line-remover", "/text-line-reverser", "/case-converter", "/json-formatter", "/base64-encoder-decoder",
  "/password-generator", "/qr-code-generator", "/url-encoder-decoder", "/csv-json-converter", "/csv-cleaner",
  "/uuid-generator", "/formrule-ai", "/passport-photo-maker", "/image-to-text", "/ats-resume-checker",
  "/hinglish-to-hindi", "/gst-invoice-generator", "/unit-converter", "/pdf-organizer",
  "/pdf-merger", "/pdf-splitter", "/jpg-to-pdf", "/pdf-to-jpg", "/pdf-to-word",
  "/pdf-to-excel", "/background-remover", "/color-converter", "/url-parser",
  "/json-to-xml-converter", "/xml-formatter", "/css-formatter", "/html-formatter",
  "/regex-tester", "/css-gradient-generator", "/json-validator", "/markdown-preview",
  "/meta-tag-generator", "/robots-txt-generator", "/json-schema-generator", "/json-to-typescript", "/sql-formatter", "/cron-expression-generator", "/javascript-minifier", "/html-minifier"
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Do not publish a guessed lastModified date. Add it only when a page's
  // actual content-update timestamp is available.
  return [
    { url: base },
    ...tools.map((path) => ({ url: base + path })),
    { url: base + "/about" },
    { url: base + "/privacy" },
    { url: base + "/terms" }
  ];
}
