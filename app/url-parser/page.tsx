import type { Metadata } from "next";
import DeveloperUtilityTool from "@/components/DeveloperUtilityTool";
export const metadata: Metadata = { title: "URL Parser Online — Split URL into Parts | PicToSpec", description: "Parse a URL into protocol, hostname, port, path, query string, hash and origin. Free online URL parser.", alternates: { canonical: "/url-parser" } };
export default function Page() { return <DeveloperUtilityTool kind="url" />; }
