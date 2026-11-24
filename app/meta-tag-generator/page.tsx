import type { Metadata } from "next";
import { MetaTagGenerator } from "@/components/SeoUtilityTools";
export const metadata: Metadata = { title: "Meta Tag Generator — Free SEO HTML Tags | PicToSpec", description: "Generate SEO title, meta description, canonical, robots and Open Graph HTML tags with this free browser-based meta tag generator.", alternates: { canonical: "/meta-tag-generator" } };
export default function Page() { return <MetaTagGenerator />; }
