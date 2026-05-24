# Google Play submission checklist

## Prerequisites

- [ ] Production site live with `NEXT_PUBLIC_SITE_URL` and legal pages deployed
- [ ] [`mobile/`](../../mobile/) Capacitor project configured with production URL
- [ ] Release keystore created (see below)

## 1. Create signing key (once)

```bash
keytool -genkey -v -keystore rasoi-release.keystore -alias rasoi -keyalg RSA -keysize 2048 -validity 10000
```

Store the keystore outside git. Configure `mobile/android/keystore.properties` (see `mobile/keystore.properties.example`).

## 2. Build release AAB

```bash
cd mobile
npm install
npm run cap:sync
npm run build:android
```

Output: `mobile/android/app/build/outputs/bundle/release/app-release.aab`

## 3. Play Console setup

1. **Create app** → default language, title **Rasoi**, type **App**, category **Food & Drink**.
2. **Store listing** — copy from [`LISTING_COPY.md`](./LISTING_COPY.md).
3. **Privacy policy** → `https://YOUR_SITE/privacy`
4. **App content** → complete questionnaire (ads: No, AI content: Yes, disclose OpenAI-generated recipes).
5. **Data safety** — declare:
   - Data collected: health/fitness (optional profile), app activity (recipe requests)
   - Data shared with third parties: OpenAI (via your server)
   - Data encrypted in transit: Yes (HTTPS)
   - Users can request deletion: clear local data / email support
6. **Content rating** — IARC questionnaire.
7. **Target audience** — not designed for children under 13.

## 4. Testing tracks

1. Upload AAB to **Internal testing**.
2. Add tester emails; install via Play Store test link.
3. Verify: profile save, recipe generation, history, legal links.
4. Promote to **Production** (staged rollout recommended).

## 5. Common rejection reasons

- Missing or broken privacy policy URL
- Misleading health/medical claims — keep “wellness inspiration only”
- App crashes on launch (wrong `CAPACITOR_SERVER_URL`)
