# Advantage Data Vision Website Migration

This project migrates `https://adv-medical.com.hk/` from WordPress into a fast
TanStack React frontend with a Rust Axum backend.

## What Is Included

- TanStack Router routes for the public site pages.
- TanStack Query-backed content access using the migrated local content JSON.
- 10 WordPress pages preserved in the site map.
- 16 posts migrated as event/detail pages.
- 84 referenced media assets downloaded and compressed for local serving.
- Rust backend APIs:
  - `GET /api/health`
  - `GET /api/pages`
  - `GET /api/posts`
  - `GET /api/posts/:slug`
- Rust static hosting for the built frontend, including SPA route fallback.

## Local Development

```bash
pnpm install
pnpm run build
ADV_SITE_BIND=127.0.0.1:8088 cargo run -p adv-medical-site-api
```

Open:

```text
http://127.0.0.1:8088/
```

## Rebuild Migrated Content

The source WordPress JSON snapshots are stored outside this project in:

```text
../adv-medical-com-hk-migration-source
```

To regenerate local content and assets:

```bash
python3 scripts/prepare_content.py
pnpm run build
```

## Deployment Notes

Build the frontend first, then run the Rust backend from the project root. By
default, the backend serves `dist` and reads `dist/content/site-content.json`.

Useful environment variables:

```text
ADV_SITE_BIND=0.0.0.0:8088
ADV_SITE_STATIC_DIR=dist
ADV_SITE_CONTENT=dist/content/site-content.json
```

Place nginx or another reverse proxy in front of the Rust process for TLS and
domain routing.
