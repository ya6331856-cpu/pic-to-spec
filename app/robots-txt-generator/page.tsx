import type { Metadata } from "next";
import { RobotsTxtGenerator } from "@/components/SeoUtilityTools";
export const metadata: Metadata = { title: "Robots.txt Generator — Free SEO Tool | PicToSpec", description: "Create a robots.txt file with user-agent, allow, disallow and sitemap directives using this free online generator.", alternates: { canonical: "/robots-txt-generator" } };
export default function Page() { return <RobotsTxtGenerator />; }
