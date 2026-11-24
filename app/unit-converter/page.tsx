import type { Metadata } from "next";
import UnitConverterTool from "@/components/UnitConverterTool";
export const metadata: Metadata = {
 title: "Unit Converter – Length, Weight, Temperature & More",
 description: "Convert meters, miles, kilograms, pounds, Celsius, Fahrenheit, liters, area and digital storage units with this free online unit converter.",
 alternates: { canonical: "https://pictospec.com/unit-converter" }
};
export default function Page(){return <UnitConverterTool/>;}
