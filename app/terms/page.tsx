import type { Metadata } from "next";
import { LegalPage } from "@/app/components/LegalPage";
import { APP_NAME, getSupportEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: `Terms of Use — ${APP_NAME}`,
  description: `Terms for using ${APP_NAME}.`,
};

export default function TermsPage() {
  const supportEmail = getSupportEmail();

  return (
    <LegalPage title="Terms of Use">
      <p>
        <strong>Last updated:</strong> May 2026
      </p>
      <p>
        By using {APP_NAME}, you agree to these terms. If you do not agree, please
        do not use the app.
      </p>

      <h2>What {APP_NAME} provides</h2>
      <p>
        {APP_NAME} offers AI-generated recipe <strong>suggestions</strong> for
        Indian home-style cooking based on information you provide. Results may be
        incomplete, inaccurate, or unsuitable for your needs.
      </p>

      <h2>Not medical or professional advice</h2>
      <p>
        Content is for general wellness and cooking inspiration only. It is not
        medical, nutritional, or allergy advice. Always verify ingredients, labels,
        and preparation—especially if you have allergies, are pregnant, or manage a
        health condition. Consult a qualified professional for medical nutrition
        needs.
      </p>

      <h2>Your responsibility</h2>
      <ul>
        <li>Check allergens and cross-contamination risks before cooking.</li>
        <li>Use safe food handling and cooking temperatures.</li>
        <li>Ensure recipes fit your dietary, religious, and health requirements.</li>
      </ul>

      <h2>Acceptable use</h2>
      <p>
        Do not misuse the service (automated scraping, attempting to bypass rate
        limits, or submitting unlawful content). We may limit or block access to
        protect the service.
      </p>

      <h2>Availability</h2>
      <p>
        The app depends on network access and third-party services (including
        OpenAI). We do not guarantee uninterrupted availability.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {APP_NAME} and its operators are not
        liable for any harm, illness, or loss arising from use of suggested recipes
        or reliance on generated content.
      </p>

      <h2>Contact</h2>
      <p>
        Questions: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
      </p>
    </LegalPage>
  );
}
