import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/app/components/LegalPage";
import { APP_NAME, getSupportEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: `Support — ${APP_NAME}`,
  description: `Get help with ${APP_NAME}.`,
};

export default function SupportPage() {
  const supportEmail = getSupportEmail();

  return (
    <LegalPage title="Support">
      <p>
        Need help with {APP_NAME}? We&apos;re happy to assist with bugs, account
        questions (there is no login—data stays on your device), or feedback.
      </p>

      <h2>Email</h2>
      <p>
        <a href={`mailto:${supportEmail}`} className="font-medium text-amber-900 dark:text-amber-400">
          {supportEmail}
        </a>
      </p>

      <h2>Common questions</h2>
      <ul>
        <li>
          <strong>Recipes won&apos;t load?</strong> Check your internet connection
          and try again. The app needs to reach our server for new suggestions.
        </li>
        <li>
          <strong>Lost your profile or history?</strong> Data is stored on this
          device only. Clearing browser or app data will remove it.
        </li>
        <li>
          <strong>Allergies?</strong> Set them in Your profile and double-check
          every ingredient before cooking.
        </li>
      </ul>

      <h2>Policies</h2>
      <p>
        See our <Link href="/privacy">Privacy Policy</Link> and{" "}
        <Link href="/terms">Terms of Use</Link>.
      </p>
    </LegalPage>
  );
}
