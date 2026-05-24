import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Production URL of the deployed Next.js app (no trailing slash).
 * Override when syncing: CAPACITOR_SERVER_URL=https://your-domain.com npx cap sync
 */
const serverUrl =
  process.env.CAPACITOR_SERVER_URL ??
  "https://indian-recipe-generator.vercel.app";

const config: CapacitorConfig = {
  appId: "com.rasoi.recipes",
  appName: "Rasoi",
  webDir: "www",
  server: {
    url: serverUrl,
    cleartext: false,
    androidScheme: "https",
  },
  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: "automatic",
  },
};

export default config;
