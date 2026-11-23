import type { Metadata } from "next";
import PasswordTool from "@/components/PasswordTool";
export const metadata: Metadata = { title: "Strong Password Generator — Create Random Secure Passwords", description: "Generate strong random passwords online with custom length, uppercase and lowercase letters, numbers and symbols. Free and private in your browser.", alternates: { canonical: "/password-generator" } };
export default function Page() { return <PasswordTool />; }
