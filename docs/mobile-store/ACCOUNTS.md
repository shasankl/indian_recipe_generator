# Developer accounts (manual steps)

These steps require your personal/company identity and payment. They cannot be automated in code.

## Apple App Store

1. Enroll in the [Apple Developer Program](https://developer.apple.com/programs/) (~$99/year).
2. Sign in to [App Store Connect](https://appstoreconnect.apple.com/).
3. Create an **App ID** with bundle ID `com.rasoi.recipes` (must match [`mobile/capacitor.config.ts`](../../mobile/capacitor.config.ts)).
4. Note your **Team ID** for signing in Xcode.

## Google Play

1. Create a [Google Play Console](https://play.google.com/console/) account (~$25 one-time).
2. Complete identity verification and developer profile.
3. Create a new app; package name must match `com.rasoi.recipes`.

## Before submitting either store

Set in **Vercel** (Production environment):

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://your-production-domain.vercel.app` |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | `support@yourdomain.com` |

Deploy, then verify these URLs load:

- `/privacy`
- `/terms`
- `/support`

Use the privacy URL in both store consoles.
