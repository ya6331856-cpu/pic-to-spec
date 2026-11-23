import type { Metadata } from "next";
import DeveloperTool from "@/components/DeveloperTool";
export const metadata: Metadata = {title:"URL Encoder & Decoder — Encode URLs Online",description:"Encode or decode URL text and special characters online. Free URL component and full URL encoder and decoder that runs in your browser.",alternates:{canonical:"/url-encoder-decoder"}};
export default function Page(){return <DeveloperTool kind="url-encoder-decoder"/>;}
