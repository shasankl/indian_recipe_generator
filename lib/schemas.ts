import { z } from "zod";

export const activityLevelSchema = z.enum([
  "sedentary",
  "light",
  "moderate",
  "active",
  "very_active",
]);

export const genderSchema = z.enum(["male", "female", "unspecified"]);

export const heightUnitSchema = z.enum(["cm", "imperial"]);

export const userProfileSchema = z.object({
  heightCm: z.number().positive("Height must be greater than 0"),
  heightUnit: heightUnitSchema,
  weightKg: z.number().positive("Weight must be greater than 0"),
  goals: z.string().min(1, "Describe at least one goal"),
  activityLevel: activityLevelSchema,
  gender: genderSchema,
});

export const recipeInputsSchema = z.object({
  meal: z.enum(["breakfast", "lunch", "dinner"]),
  preferences: z.string(),
  maxPrepMinutes: z
    .number()
    .int()
    .positive()
    .max(240, "Max prep time is 240 minutes"),
});

export const recipeRequestSchema = z.object({
  profile: userProfileSchema,
  inputs: recipeInputsSchema,
});

export const recipeResponseSchema = z.object({
  title: z.string(),
  ingredients: z.array(
    z.object({
      item: z.string(),
      amount: z.string(),
    }),
  ),
  steps: z.array(z.string()),
  macros: z.object({
    calories: z.number(),
    protein_g: z.number(),
    carbs_g: z.number(),
    fat_g: z.number(),
  }),
  notes: z.string(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export type RecipeInputs = z.infer<typeof recipeInputsSchema>;
export type RecipeRequest = z.infer<typeof recipeRequestSchema>;
export type RecipeResponse = z.infer<typeof recipeResponseSchema>;

export const defaultProfile: UserProfile = {
  heightCm: 170,
  heightUnit: "cm",
  weightKg: 70,
  goals: "",
  activityLevel: "moderate",
  gender: "unspecified",
};
