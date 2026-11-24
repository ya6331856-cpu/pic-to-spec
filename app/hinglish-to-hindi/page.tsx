import type { Metadata } from "next";
import HinglishTool from "@/components/HinglishTool";
export const metadata: Metadata = {
 title: "Hinglish to Hindi Converter – English to Hindi Typing",
 description: "Type Hindi in English letters and convert Romanized Hinglish into Devanagari text. Copy Hindi output for messages, notes and drafts.",
 alternates: { canonical: "https://pictospec.com/hinglish-to-hindi" }
};
export default function Page(){return <HinglishTool/>;}
