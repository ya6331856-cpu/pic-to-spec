import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import PixoGuide from "@/components/PixoGuide";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://pictospec.com"),
  title: { default: "PicToSpec — Free Image, PDF, Text & Calculator Tools", template: "%s" },
  description: "Free online image, PDF, text and calculator tools. Compress photos, manage documents and get quick results in your browser.",
  applicationName: "PicToSpec",
  creator: "PicToSpec",
  publisher: "PicToSpec",
  category: "technology",
  keywords: ["free online tools", "image compressor", "PDF tools", "GST calculator", "text tools", "developer tools", "SEO tools"],
  icons: { icon: "/icon.svg", shortcut: "/icon.svg" },
  openGraph: { title: "PicToSpec — Free Image, PDF, Text & Calculator Tools", description: "Compress and resize images, manage PDFs, format text and data, create QR codes and use free online calculators. No account needed.", locale: "en_US", type: "website", siteName: "PicToSpec", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PicToSpec free online tools with Pixo the mascot" }] },
  twitter: { card: "summary_large_image", title: "PicToSpec — Free Online Tools", description: "Free browser-based tools for images, PDFs, text, calculations and development.", images: ["/opengraph-image"] },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const configuredMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  const measurementId =
    configuredMeasurementId && /^G-[A-Z0-9]+$/.test(configuredMeasurementId)
      ? configuredMeasurementId
      : null;

  return (
    <html lang="en">
      <body>
        <Script id="pictospec-site-schema" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "Organization", "@id": "https://pictospec.com/#organization", "name": "PicToSpec", "url": "https://pictospec.com/" },
              { "@type": "WebSite", "@id": "https://pictospec.com/#website", "url": "https://pictospec.com/", "name": "PicToSpec", "publisher": { "@id": "https://pictospec.com/#organization" }, "inLanguage": "en" }
            ]
          })}
        </Script>
        <SiteHeader />
        <div id="page-content">{children}</div>
        <SiteFooter />
        <PixoGuide />
        {measurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${measurementId}', { anonymize_ip: true });
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
