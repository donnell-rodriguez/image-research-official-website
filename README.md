# Advantage Data Vision Official Website

Static official website source for `https://adv-medical.com.hk/`.

## Stack

- React 18
- TanStack Router
- Vite static build
- Local JSON content under `public/content`
- Static media under `public/assets`

The project does not require a runtime backend. Build output is written to `dist/`
and can be uploaded to Bluehost, served by nginx, or deployed to any static host.

## Scripts

```bash
pnpm install
pnpm run dev
pnpm run verify
pnpm run build
```

`pnpm run verify` runs the project quality gates:

- asset reference audit
- image alt text audit
- content route audit
- production build
- performance budget audit

## Project Structure

```text
src/
  components/     Shared React components
  hooks/          Browser hooks for content, SEO, and page effects
  lib/            Small formatting and content helpers
  pages/          Route-level page components
  styles/         Layered CSS by page/system area
public/
  assets/         Optimized images, videos, and fonts
  content/        Static JSON used by the site
docs/             Deployment and brand notes
scripts/          Local quality and SEO generation scripts
```

## Build And Deploy

```bash
pnpm run build
```

Upload the contents of `dist/` to the web root. The repository intentionally
does not track `dist/`, `node_modules/`, local audit screenshots, temporary
assets, or Bluehost zip packages.

For Bluehost, keep `public/.htaccess` in the build output. For nginx, use
`docs/nginx-static-cache.conf` as a reference for static cache headers and SPA
fallback behavior.

## Brand System

The site uses the ADV green visual system documented in
`docs/lightweight-brand-system.md`. New pages and product materials should reuse
the same brand tokens instead of introducing another primary CTA color.
