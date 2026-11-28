import type { Metadata } from "next";
import TypingSpeedTestTool from "@/components/TypingSpeedTestTool";

export const metadata: Metadata = {
  title: "Typing Test – Free Online WPM & Accuracy Test",
  description:
    "Take a free online typing test for 30, 60 or 120 seconds. Check words per minute (WPM), accuracy and typing errors as you type in your browser.",
  alternates: { canonical: "/typing-speed-test" },
};

export default function Page() {
  return <TypingSpeedTestTool />;
}
