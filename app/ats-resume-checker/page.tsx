import type { Metadata } from "next";
import ATSResumeTool from "@/components/ATSResumeTool";
export const metadata: Metadata = {
 title: "ATS Resume Checker – Resume Checklist & Job Keywords",
 description: "Check resume structure, contact details, section headings and keyword overlap with a job description using a free browser-based resume checklist.",
 alternates: { canonical: "https://pictospec.com/ats-resume-checker" }
};
export default function Page(){return <ATSResumeTool/>;}
