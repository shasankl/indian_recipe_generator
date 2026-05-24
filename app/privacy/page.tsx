import type { Metadata } from "next";
import { LegalPage } from "@/app/components/LegalPage";
import { APP_NAME, getSupportEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy Policy — ${APP_NAME}`,
  description: `How ${APP_NAME} handles your data.`,
};

export default function PrivacyPage() {
  const supportEmail = getSupportEmail();

  return (
    <LegalPage title="Privacy Policy">
      <p>
        <strong>Last updated:</strong> May 2026
      </p>
      <p>
        {APP_NAME} (&quot;we&quot;, &quot;the app&quot;) helps you generate Indian
        home-style recipe ideas. This policy explains what information is used when
        you use our website or mobile app.
      </p>

      <h2>Summary</h2>
      <ul>
        <li>We do not require an account or login.</li>
        <li>
          Your profile (height, weight, goals, diet, allergies, activity) and meal
          history are stored <strong>on your device only</strong> (browser or app
          storage), unless you clear site data.
        </li>
        <li>
          When you request a recipe, your profile and meal preferences are sent to
          our server so we can call OpenAI and return a suggestion.
        </li>
      </ul>

      <h2>Information stored on your device</h2>
      <p>Locally saved data may include:</p>
      <ul>
        <li>Profile details you enter (body metrics, goals, diet type, allergies)</li>
        <li>Meal history (saved recipes, meal type, and request inputs)</li>
      </ul>
      <p>
        You can remove this data anytime by clearing the app&apos;s site data or
        using &quot;Clear all&quot; in meal history.
      </p>

      <h2>Information sent to our servers</h2>
      <p>When you tap &quot;Suggest a recipe&quot;, we send:</p>
      <ul>
        <li>Your profile and form inputs (meal, cuisine, tastes, cook time)</li>
        <li>Recent dish titles (to reduce repeats)—not full past recipes</li>
        <li>Your IP address (used only for rate limiting abuse)</li>
      </ul>
      <p>
        Our server uses <strong>OpenAI</strong> to generate recipe text. OpenAI
        processes the prompt according to their policies. Do not submit information
        you are not comfortable sharing for recipe generation.
      </p>

      <h2>What we do not do</h2>
      <ul>
        <li>We do not sell your personal information.</li>
        <li>We do not use advertising trackers in the app today.</li>
        <li>We do not provide medical diagnosis or treatment.</li>
      </ul>

      <h2>Children</h2>
      <p>
        The app is not directed at children under 13. If you believe a child has
        provided personal information, contact us and we will assist with
        deletion where applicable.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy. The &quot;Last updated&quot; date will change when
        we do. Continued use after changes means you accept the revised policy.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy:{" "}
        <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
      </p>
    </LegalPage>
  );
}
