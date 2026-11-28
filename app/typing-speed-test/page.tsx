import type { Metadata } from "next";
import TypingSpeedTestTool from "@/components/TypingSpeedTestTool";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Typing Test – Free Online WPM & Accuracy Test",
  description:
    "Take a free online typing test for 30, 60 or 120 seconds. Check words per minute (WPM), accuracy and typing errors as you type in your browser.",
  alternates: { canonical: "/typing-speed-test" },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/typing-speed-test"
        name="Online Typing Speed Test"
        description="Practise typing for 30, 60 or 120 seconds and review net words per minute, accuracy and errors."
        applicationCategory="EducationalApplication"
        features={[
          "30, 60 and 120 second practice tests",
          "Measure net words per minute",
          "Review typing accuracy and errors",
          "Run the test in the browser",
        ]}
      />
      <TypingSpeedTestTool />
    </>
  );
}
