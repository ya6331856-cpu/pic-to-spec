import type { MetadataRoute } from "next";
const base = "https://pictospec.com";
const lastModified = new Date("2026-11-24");
const tools = [
  "/compress-image-to-50kb", "/resize-photo-for-online-form", "/signature-resizer",
  "/jpg-to-webp", "/image-compressor", "/image-resizer", "/image-cropper", "/image-converter",
  "/gst-calculator", "/emi-calculator", "/percentage-calculator", "/discount-calculator", "/age-calculator",
  "/word-counter", "/case-converter", "/json-formatter", "/base64-encoder-decoder",
  "/password-generator", "/qr-code-generator", "/url-encoder-decoder", "/csv-json-converter",
  "/uuid-generator", "/formrule-ai", "/passport-photo-maker", "/image-to-text", "/ats-resume-checker", "/hinglish-to-hindi", "/gst-invoice-generator", "/unit-converter", "/pdf-organizer", "/pdf-merger", "/pdf-splitter", "/jpg-to-pdf", "/pdf-to-jpg", "/pdf-to-word"
];
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, lastModified, changeFrequency: "weekly", priority: 1 },
    ...tools.map((path) => ({ url: base + path, lastModified, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: base + "/about", lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: base + "/privacy", lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: base + "/terms", lastModified, changeFrequency: "yearly", priority: 0.3 }
  ];
}
