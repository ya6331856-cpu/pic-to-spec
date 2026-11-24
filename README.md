# PicToSpec

PicToSpec is a browser-based collection of practical image, PDF, text, data, QR-code, password and calculator tools. It is built with Next.js, React and TypeScript. The tools in this version process files and entered text in the user's browser; they are not uploaded to a PicToSpec processing server.

## Tool directory

### Image tools
- `/image-compressor` — compress JPG, PNG and WebP images
- `/compress-image-to-50kb` — target-size image compression
- `/image-resizer` — resize image dimensions
- `/resize-photo-for-online-form` — prepare an image for an online form
- `/signature-resizer` — resize a signature image
- `/image-cropper` — crop an image by pixel coordinates
- `/image-converter` — convert between supported image formats
- `/jpg-to-webp` — convert JPG images to WebP
- `/background-remover` — remove image backgrounds in the browser
- `/image-to-text` — extract English text from images using OCR
- `/passport-photo-maker` — prepare passport-style photo sheets

### PDF tools
- `/pdf-merger` — combine PDF files
- `/pdf-splitter` — extract a page range from a PDF
- `/pdf-organizer` — reorder, remove and rotate PDF pages
- `/jpg-to-pdf` — create a PDF from images
- `/pdf-to-jpg` — render PDF pages as JPG or PNG images
- `/pdf-to-word` — extract selectable PDF text into DOCX
- `/pdf-to-excel` — extract table-like PDF content into XLSX

### Calculators
- `/age-calculator`
- `/discount-calculator`
- `/emi-calculator`
- `/gst-calculator`
- `/percentage-calculator`
- `/unit-converter`

### Text and developer tools
- `/word-counter`
- `/case-converter`
- `/json-formatter`
- `/base64-encoder-decoder`
- `/url-encoder-decoder`
- `/csv-json-converter`
- `/uuid-generator`
- `/hinglish-to-hindi`
- `/formrule-ai` — rule-based form photo and signature requirement helper
- `/ats-resume-checker` — heuristic resume structure and keyword review
- `/gst-invoice-generator` — basic GST invoice PDF template

### QR and password tools
- `/qr-code-generator`
- `/password-generator`

## Information pages
- `/` — homepage and quick image workspace
- `/about` — about PicToSpec
- `/privacy` — privacy policy
- `/terms` — terms of use

The legacy `/image-cutter` path redirects to `/image-cropper` and is intentionally excluded from the sitemap.

## Local development

Requirements: Node.js 20 or later and npm.

```bash
npm install
npm run dev
```

Open the local development URL printed by Next.js.

## Quality checks

```bash
npm test
npm run typecheck
npm run build
npm audit --omit=dev --audit-level=moderate
node scripts/smoke-test.mjs
```

GitHub Actions runs the unit tests, production-dependency audit, TypeScript typecheck, production build and production-route smoke tests on pushes to `main`, pull requests targeting `main`, and the scheduled verification workflow.

The production smoke test checks all canonical pages, the legacy image-cutter redirect, sitemap entries and the robots sitemap reference. It does not replace real-device interaction testing.

## Optional Google Analytics 4

Analytics is disabled unless the site owner sets `NEXT_PUBLIC_GA_MEASUREMENT_ID` in the hosting environment. To enable it, create a GA4 web data stream and set the variable to its Measurement ID (normally beginning with `G-`). Do not put credentials, API secrets or private tokens in this public variable. The privacy policy explains the optional analytics collection.

## Search and indexing

- Canonical website origin: `https://pictospec.com`
- Sitemap: `https://pictospec.com/sitemap.xml`
- Robots file: `https://pictospec.com/robots.txt`

The sitemap includes the homepage, 37 tool pages and the About, Privacy and Terms pages. Submit the sitemap in Google Search Console's **Sitemaps** section. Use URL Inspection for individual canonical pages; the presence of a URL in the sitemap does not guarantee indexing or ranking.
