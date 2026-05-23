import type { RecipeInputs, UserProfile } from "@/lib/schemas";

const ACTIVITY_LABEL: Record<UserProfile["activityLevel"], string> = {
  sedentary: "sedentary (little or no exercise)",
  light: "light (1–3 days/week)",
  moderate: "moderate (3–5 days/week)",
  active: "active (6–7 days/week)",
  very_active: "very active (intense daily training)",
};

const GENDER_LABEL: Record<UserProfile["gender"], string> = {
  male: "male",
  female: "female",
  unspecified: "not specified",
};

const DIET_TYPE_LABEL: Record<UserProfile["dietType"], string> = {
  veg: "vegetarian (no meat, fish, or eggs)",
  non_veg: "non-vegetarian (meat/fish/eggs allowed)",
  other: "other (see details)",
};

function formatProfileDiet(profile: UserProfile): string {
  if (profile.dietType === "other") {
    return profile.dietOther.trim();
  }
  return DIET_TYPE_LABEL[profile.dietType];
}

export type BuildRecipePromptOptions = {
  avoidRecentTitles?: string[];
  /** Stronger wording when retrying after a duplicate title. */
  forceDistinct?: boolean;
};

export function buildRecipePrompt(
  profile: UserProfile,
  inputs: RecipeInputs,
  options: BuildRecipePromptOptions = {},
) {
  const { avoidRecentTitles = [], forceDistinct = false } = options;
  const system = `You are a helpful cooking assistant focused on Indian home cooking and sensible, practical meals.
Use metric units in ingredient amounts where appropriate.
Keep instructions clear and concise for a home cook.
This is general wellness information only—not medical advice. Do not claim to treat diseases; encourage consulting healthcare professionals for medical nutrition therapy.

Respond only with JSON matching the requested schema—no markdown, no code fences.`;

  const user = `Create one recipe for the following person and constraints.

## Person
- Gender: ${GENDER_LABEL[profile.gender]}
- Height: ${profile.heightCm} cm
- Weight: ${profile.weightKg} kg
- Goals: ${profile.goals}
- Activity: ${ACTIVITY_LABEL[profile.activityLevel]}
- Diet: ${formatProfileDiet(profile)}

## Meal request
- Meal: ${inputs.meal}
- Dietary preferences / restrictions / dislikes: ${inputs.preferences || "none specified"}
- Time to cook (active cooking and simple prep only): ${inputs.maxPrepMinutes} minutes maximum

## Requirements
- Favor Indian ingredients and techniques where it fits the preferences above.
- Estimate macros for one serving of the recipe you describe (numbers only, approximate).
- Include a short "notes" string (can mention substitutions or allergy reminders if relevant; use empty string if nothing to add).`;

  const avoidBlock =
    avoidRecentTitles.length > 0
      ? `

## Recent meals to avoid
The user has had these ${inputs.meal} dishes recently. Suggest something clearly different (not a minor rename of the same dish): ${avoidRecentTitles.join("; ")}.${
          forceDistinct
            ? " Your previous suggestion was too similar—pick a genuinely different dish and title."
            : ""
        }`
      : "";

  return { system, user: user + avoidBlock };
}
