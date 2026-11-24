import type { Metadata } from "next";
import PassportPhotoTool from "@/components/PassportPhotoTool";
export const metadata: Metadata = {
 title: "Passport Photo Maker & Print Sheet Online",
 description: "Create a passport-style photo print sheet with multiple copies. Set custom pixel dimensions and prepare a 4×6 or A4 layout in your browser.",
 alternates: { canonical: "https://pictospec.com/passport-photo-maker" }
};
export default function Page(){return <PassportPhotoTool/>;}
