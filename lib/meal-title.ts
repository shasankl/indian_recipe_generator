/** Normalize a recipe title for duplicate comparison. */
export function normalizeMealTitle(title: string): string {
  return title.trim().toLowerCase();
}
