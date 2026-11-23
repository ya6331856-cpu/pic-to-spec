import type { MetadataRoute } from "next";
const base = "https://pictospec.com";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, lastModified: new Date("2026-11-23"), changeFrequency: "weekly", priority: 1 },
    { url: base + "/compress-image-to-50kb", lastModified: new Date("2026-11-23"), changeFrequency: "monthly", priority: 0.9 },
    { url: base + "/resize-photo-for-online-form", lastModified: new Date("2026-11-23"), changeFrequency: "monthly", priority: 0.9 },
    { url: base + "/signature-resizer", lastModified: new Date("2026-11-23"), changeFrequency: "monthly", priority: 0.9 },
    { url: base + "/jpg-to-webp", lastModified: new Date("2026-11-23"), changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/image-compressor", lastModified: new Date("2026-11-23"), changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/image-resizer", lastModified: new Date("2026-11-23"), changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/image-cropper", lastModified: new Date("2026-11-23"), changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/image-converter", lastModified: new Date("2026-11-23"), changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/image-cutter", lastModified: new Date("2026-11-23"), changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/gst-calculator", lastModified: new Date("2026-11-23"), changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/emi-calculator", lastModified: new Date("2026-11-23"), changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/percentage-calculator", lastModified: new Date("2026-11-23"), changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/discount-calculator", lastModified: new Date("2026-11-23"), changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/age-calculator", lastModified: new Date("2026-11-23"), changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/privacy", lastModified: new Date("2026-11-23"), changeFrequency: "yearly", priority: 0.2 }
  ];
}