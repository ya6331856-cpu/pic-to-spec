import type { Metadata } from "next";
import QuickUtilityTool from "@/components/QuickUtilityTool";
export const metadata: Metadata = { title: "Unix Timestamp Converter Online | PicToSpec", description: "Convert Unix timestamps in seconds or milliseconds into readable UTC date and time. Free online timestamp converter.", alternates: { canonical: "/unix-timestamp-converter" } };
export default function Page() { return <QuickUtilityTool kind="timestamp" />; }
