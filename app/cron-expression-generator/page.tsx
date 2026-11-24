import type { Metadata } from "next";
import ScheduleDeveloperTools from "@/components/ScheduleDeveloperTools";
export const metadata: Metadata = { title: "Cron Expression Generator — Build & Explain Cron Schedules | PicToSpec", description: "Create and validate five-field cron expressions with presets, field controls and plain-language schedule explanations. Free online cron generator.", alternates: { canonical: "/cron-expression-generator" } };
export default function Page() { return <ScheduleDeveloperTools mode="cron" />; }
