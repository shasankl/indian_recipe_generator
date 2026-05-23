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

export const dietTypeSchema = z.enum(["veg", "non_veg", "other"]);

export const userProfileSchema = z
  .object({
    heightCm: z.number().positive("Height must be greater than 0"),
    heightUnit: heightUnitSchema,
    weightKg: z.number().positive("Weight must be greater than 0"),
    goals: z.string().min(1, "Describe at least one goal"),
    activityLevel: activityLevelSchema,
    gender: genderSchema,
    dietType: dietTypeSchema,
    dietOther: z.string(),
  })
  .refine(
    (data) =>
      data.dietType !== "other" || data.dietOther.trim().length > 0,
    {
      message: "Please describe your diet (e.g. gluten free, vegan)",
      path: ["dietOther"],
    },
  );

export const recipeInputsSchema = z.object({
  meal: z.enum(["breakfast", "lunch", "dinner"]),
  preferences: z.string(),
  maxPrepMinutes: z
    .number()
    .int()
    .positive()
    .max(240, "Max cook time is 240 minutes"),
});

export const mealTypeSchema = recipeInputsSchema.shape.meal;

export const recipeRequestSchema = z.object({
  profile: userProfileSchema,
  inputs: recipeInputsSchema,
  avoidRecentTitles: z.array(z.string()).max(20).optional(),
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

export const mealHistoryEntrySchema = z.object({
  id: z.string().min(1),
  meal: mealTypeSchema,
  servedAt: z.string().datetime(),
  inputs: recipeInputsSchema,
  recipe: recipeResponseSchema,
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export type RecipeInputs = z.infer<typeof recipeInputsSchema>;
export type MealType = z.infer<typeof mealTypeSchema>;
export type MealHistoryEntry = z.infer<typeof mealHistoryEntrySchema>;
export type RecipeRequest = z.infer<typeof recipeRequestSchema>;
export type RecipeResponse = z.infer<typeof recipeResponseSchema>;

export const defaultProfile: UserProfile = {
  heightCm: 170,
  heightUnit: "cm",
  weightKg: 70,
  goals: "",
  activityLevel: "moderate",
  gender: "unspecified",
  dietType: "veg",
  dietOther: "",
};
