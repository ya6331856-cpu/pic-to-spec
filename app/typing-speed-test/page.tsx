import type { Metadata } from "next";
import TypingSpeedTestTool from "@/components/TypingSpeedTestTool";

export const metadata: Metadata = {
  title: "Typing Speed Test – Free Online WPM & Accuracy Test",
  description: "Take a free online typing speed test. Measure net WPM, typing accuracy and errors with 30, 60 or 120-second practice tests.",
  alternates: { canonical: "https://pictospec.com/typing-speed-test" }
};

export default function Page() {
  return <TypingSpeedTestTool />;
}
