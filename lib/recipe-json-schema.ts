/** JSON Schema for OpenAI structured output (strict mode). */
export const RECIPE_JSON_SCHEMA = {
  name: "recipe_response",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      title: { type: "string" },
      ingredients: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            item: { type: "string" },
            amount: { type: "string" },
          },
          required: ["item", "amount"],
        },
      },
      steps: {
        type: "array",
        items: { type: "string" },
      },
      macros: {
        type: "object",
        additionalProperties: false,
        properties: {
          calories: { type: "number" },
          protein_g: { type: "number" },
          carbs_g: { type: "number" },
          fat_g: { type: "number" },
        },
        required: ["calories", "protein_g", "carbs_g", "fat_g"],
      },
      notes: { type: "string" },
    },
    required: ["title", "ingredients", "steps", "macros", "notes"],
  },
} as const;
