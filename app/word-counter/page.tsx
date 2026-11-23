import type { Metadata } from "next";
import TextTool from "@/components/TextTool";
export const metadata: Metadata = { title: "Word Counter — Count Words, Characters, Sentences Online", description: "Free online word and character counter. Count words, characters with or without spaces, sentences, paragraphs and lines instantly.", alternates: { canonical: "/word-counter" } };
export default function Page() { return <TextTool kind="word-counter" />; }
