import type { Metadata } from "next";
import DeveloperTool from "@/components/DeveloperTool";
export const metadata: Metadata = {title:"UUID Generator — Generate Random UUID v4 Online",description:"Generate random version 4 UUIDs online. Create up to 100 secure random identifiers and copy them instantly in your browser.",alternates:{canonical:"/uuid-generator"}};
export default function Page(){return <DeveloperTool kind="uuid-generator"/>;}
