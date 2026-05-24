import type { UserProfile } from "@/lib/schemas";
import { defaultProfile } from "@/lib/schemas";

const STORAGE_KEY = "indian-recipe-app-profile";

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") {
    return { ...defaultProfile };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultProfile };
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    return {
      ...defaultProfile,
      ...parsed,
      heightCm: Number(parsed.heightCm) || defaultProfile.heightCm,
      heightUnit:
        parsed.heightUnit === "cm" || parsed.heightUnit === "imperial"
          ? parsed.heightUnit
          : defaultProfile.heightUnit,
      weightKg: Number(parsed.weightKg) || defaultProfile.weightKg,
      goals: typeof parsed.goals === "string" ? parsed.goals : defaultProfile.goals,
      activityLevel: parsed.activityLevel ?? defaultProfile.activityLevel,
      gender:
        parsed.gender === "male" ||
        parsed.gender === "female" ||
        parsed.gender === "unspecified"
          ? parsed.gender
          : defaultProfile.gender,
      dietType:
        parsed.dietType === "veg" ||
        parsed.dietType === "non_veg" ||
        parsed.dietType === "other"
          ? parsed.dietType
          : defaultProfile.dietType,
      dietOther:
        typeof parsed.dietOther === "string"
          ? parsed.dietOther
          : defaultProfile.dietOther,
      allergies:
        typeof parsed.allergies === "string"
          ? parsed.allergies
          : defaultProfile.allergies,
    };
  } catch {
    return { ...defaultProfile };
  }
}

export function persistProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
