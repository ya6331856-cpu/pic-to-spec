# PicToSpec

A browser-based image preparation tool built with Next.js. Users can compress images to a target KB size, resize dimensions, and convert JPG/PNG/WebP files. Processing happens locally in the browser.

## Routes
- `/` — image workspace
- `/compress-image-to-50kb` — image compression guide
- `/resize-photo-for-online-form` — photo dimensions guide
- `/signature-resizer` — signature image guide
- `/jpg-to-webp` — format conversion guide
- `/privacy` — privacy policy

## Local development
```bash
npm install
npm run dev
```

## Checks
```bash
npm run typecheck
npm run build
```

Before launch, replace the candidate domain `pictospec.com` in metadata, robots and sitemap if a different domain is selected. Verify the domain and Search Console property before submitting the sitemap.