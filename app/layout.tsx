import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pictospec.com"),
  title: { default: "PicToSpec — Free Image, PDF, Text & Calculator Tools", template: "%s | PicToSpec" },
  description: "Use free browser-based tools to compress and resize images, merge PDFs, format text and data, create QR codes, generate passwords and calculate everyday figures. No account needed.",
  applicationName: "PicToSpec",
  alternates: { canonical: "/" },
  keywords: ["compress image to 50kb", "photo resize for online form", "signature resize", "image compressor", "JPG to WebP"],
  openGraph: { title: "PicToSpec — Images prepared to exact specifications", description: "Resize, compress and convert images in your browser. Your files stay on your device.", type: "website", siteName: "PicToSpec" },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const configuredMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  const measurementId =
    configuredMeasurementId && /^G-[A-Z0-9]+$/.test(configuredMeasurementId)
      ? configuredMeasurementId
      : undefined;

  return (
    <html lang="en">
      <body>
        {children}
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
