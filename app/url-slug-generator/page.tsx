import type { Metadata } from "next";
import QuickUtilityTool from "@/components/QuickUtilityTool";
export const metadata: Metadata = { title: "URL Slug Generator — Create SEO Slugs", description: "Turn page titles into clean, readable URL slugs. Generate SEO-friendly slugs with hyphens or underscores in your browser.", alternates: { canonical: "/url-slug-generator" } };
export default function Page() { return <QuickUtilityTool kind="slug" />; }
