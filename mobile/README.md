# Rasoi mobile (Capacitor)

Native iOS and Android shells that load the deployed Rasoi web app. The Next.js API stays on Vercel; do not embed `OPENAI_API_KEY` in the mobile project.

## Setup

```bash
cd mobile
npm install
```

Set your production URL (required if not using the default in `capacitor.config.ts`):

```bash
export CAPACITOR_SERVER_URL=https://your-production-domain.vercel.app
npm run cap:sync
```

### iOS (macOS only)

Install [Xcode](https://developer.apple.com/xcode/) and CocoaPods (`brew install cocoapods`), then:

```bash
npx cap add ios   # once, if ios/ is missing
npm run cap:sync
npm run open:ios
```

Android is already scaffolded under `android/`. iOS must be generated on a Mac.

## Open native IDEs

```bash
npm run open:android   # Android Studio
npm run open:ios       # Xcode (macOS only, after cap add ios)
```

## App icons

Use [Android Studio](https://developer.android.com/studio) / Xcode asset catalogs, or run `npx capacitor-assets generate` from `mobile/` (see `@capacitor/assets` docs) using `../public/icons/icon-512.png` as the source.

## Build for stores

- **Android AAB:** see [../docs/mobile-store/GOOGLE_PLAY.md](../docs/mobile-store/GOOGLE_PLAY.md)
- **iOS IPA:** see [../docs/mobile-store/APPLE_APP_STORE.md](../docs/mobile-store/APPLE_APP_STORE.md)

## Bundle ID

`com.rasoi.recipes` — must match App Store Connect and Play Console.

## Troubleshooting

- **Blank WebView:** confirm `CAPACITOR_SERVER_URL` is correct and the site loads in mobile Safari/Chrome.
- **API errors:** ensure Vercel env vars (`OPENAI_API_KEY`, etc.) are set on production.
- After changing `capacitor.config.ts`, run `npm run cap:sync` again.
