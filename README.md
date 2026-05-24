# Rasoi

Tasty, healthy desi recipe suggestions tailored to your profile, diet, allergies, and time to cook. Built with Next.js and OpenAI.

## Getting started (web)

```bash
npm install
cp .env.example .env.local   # add OPENAI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

See [`.env.example`](.env.example). For production (Vercel), also set:

- `NEXT_PUBLIC_SITE_URL` — public URL for legal/support links
- `NEXT_PUBLIC_SUPPORT_EMAIL` — shown on `/support` and store listings

## Deploy (Vercel)

Connect the repo to Vercel, set env vars, deploy. The app needs `OPENAI_API_KEY` on the server for `/api/recipe`.

## Legal pages

- [/privacy](app/privacy/page.tsx) — Privacy Policy
- [/terms](app/terms/page.tsx) — Terms of Use
- [/support](app/support/page.tsx) — Support

Required for App Store and Google Play submissions.

## Mobile app (App Store / Google Play)

Rasoi ships as a **Capacitor** wrapper around the production website.

| Guide | Purpose |
|-------|---------|
| [docs/mobile-store/ACCOUNTS.md](docs/mobile-store/ACCOUNTS.md) | Apple & Google developer accounts |
| [mobile/README.md](mobile/README.md) | Capacitor setup & builds |
| [docs/mobile-store/GOOGLE_PLAY.md](docs/mobile-store/GOOGLE_PLAY.md) | Play Store checklist |
| [docs/mobile-store/APPLE_APP_STORE.md](docs/mobile-store/APPLE_APP_STORE.md) | App Store checklist |
| [docs/mobile-store/LISTING_COPY.md](docs/mobile-store/LISTING_COPY.md) | Store description text |

Quick start:

```bash
cd mobile
npm install
CAPACITOR_SERVER_URL=https://your-production-url npm run cap:sync
npm run open:ios      # or open:android
```

## PWA

`public/manifest.webmanifest` and icons under `public/icons/` support add-to-home-screen and store review polish.
