# Apple App Store submission checklist

## Prerequisites

- [ ] [Apple Developer Program](https://developer.apple.com/programs/) membership
- [ ] Mac with Xcode installed
- [ ] Production site + legal pages live

## 1. App Store Connect

1. **My Apps** → **+** → New App.
2. Platform: iOS, name **Rasoi**, bundle ID `com.rasoi.recipes`, SKU e.g. `rasoi-001`.
3. **Privacy Policy URL**: `https://YOUR_SITE/privacy`
4. **Support URL**: `https://YOUR_SITE/support`

## 2. Build and upload

```bash
cd mobile
npm install
npm run cap:sync
npm run open:ios
```

In Xcode:

1. Select **Rasoi** target → **Signing & Capabilities** → your Team.
2. Set version **1.0.0**, build **1**.
3. **Product → Archive** → **Distribute App** → App Store Connect.

Or use Transporter with the exported `.ipa`.

## 3. App information

Use copy from [`LISTING_COPY.md`](./LISTING_COPY.md).

**Screenshots** (required sizes — capture from iPhone simulator or device):

- 6.7" (1290×2796) — iPhone 15 Pro Max
- 6.5" (1284×2778) — optional if supporting smaller phones
- Show: hero, suggest form, recipe result, meal history tab

## 4. App Privacy

Declare data types you collect via the app:

| Data | Linked to user | Purpose |
|------|----------------|---------|
| Health (optional profile) | No (no account) | App functionality |
| User content (preferences, allergies) | No | App functionality |

Note: data is sent to your server/OpenAI when generating recipes.

## 5. Review notes (recommended)

In **App Review Information**, add:

> Rasoi is a recipe suggestion app. The iOS build loads our HTTPS web app in a native shell. Users may optionally save profile data on-device only. Recipe text is generated server-side via OpenAI. Content is general wellness inspiration, not medical advice.

## 6. Submit for review

1. Select the uploaded build.
2. Complete **Export Compliance** (typically no encryption beyond HTTPS).
3. Submit.

Review often takes 24–48 hours. WebView apps may receive questions about minimum functionality—ensure the wrapped site works without desktop-only UI.
