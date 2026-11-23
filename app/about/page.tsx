export const metadata = {
  title: "About PicToSpec",
  description: "Learn about PicToSpec and its free browser-based image, PDF, text, QR and calculator tools.",
  alternates: { canonical: "/about" },
  robots: { index: true, follow: true }
};

export default function AboutPage() {
  return <main className="legal">
    <a href="/" className="back">← Back to PicToSpec</a>
    <p className="kicker">ABOUT THE PROJECT</p>
    <h1>Useful tools, without the extra steps.</h1>
    <p>PicToSpec is an online toolbox designed to make everyday digital tasks easier. It brings together practical tools for preparing images, working with PDFs, formatting text and data, creating QR codes, generating passwords and doing quick calculations.</p>
    <h2>What you can do here</h2>
    <p>Use image tools to compress, resize, crop and convert common image formats. Work with PDFs by merging documents, splitting page ranges or turning images into a PDF. You can also count and convert text, format JSON, convert CSV and JSON, generate UUIDs and QR codes, and use everyday calculators.</p>
    <h2>Designed for straightforward use</h2>
    <p>Tools are intended to work directly in your web browser, without requiring an account. For the browser-based tools in this version, files and entered text are processed on your device rather than uploaded to a PicToSpec processing server. Your browser may still use memory and temporary local object URLs while a tool is running.</p>
    <h2>Accuracy and limitations</h2>
    <p>We aim to make each tool clear and useful, but results can depend on your browser, input files and selected settings. Always check output files and verify important calculations before relying on them for official, financial, legal or other high-impact decisions.</p>
    <h2>Contact</h2>
    <p>Questions, feedback or suggestions? Email <a href="mailto:ya6331856@gmail.com">ya6331856@gmail.com</a>.</p>
    <p><a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Use</a></p>
  </main>;
}
