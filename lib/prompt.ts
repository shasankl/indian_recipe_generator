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

export function buildRecipePrompt(profile: UserProfile, inputs: RecipeInputs) {
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

## Meal request
- Meal: ${inputs.meal}
- Dietary preferences / restrictions / dislikes: ${inputs.preferences || "none specified"}
- Maximum time to prepare (active cooking + simple prep): ${inputs.maxPrepMinutes} minutes

## Requirements
- Favor Indian ingredients and techniques where it fits the preferences above.
- Estimate macros for one serving of the recipe you describe (numbers only, approximate).
- Include a short "notes" string (can mention substitutions or allergy reminders if relevant; use empty string if nothing to add).`;

  return { system, user };
}
