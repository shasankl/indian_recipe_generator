import { normalizeMealTitle } from "@/lib/meal-title";
import {
  mealHistoryEntrySchema,
  type MealHistoryEntry,
  type MealType,
  type RecipeInputs,
  type RecipeResponse,
} from "@/lib/schemas";

const STORAGE_KEY = "indian-recipe-app-meal-history";

/** Maximum recipes kept; older entries are dropped when a new one is saved. */
export const MAX_HISTORY_ENTRIES = 10;
const AVOID_TITLE_LIMIT = 14;
const AVOID_WITHIN_DAYS = 30;

export type GetAvoidTitlesOptions = {
  limit?: number;
  withinDays?: number;
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function parseHistory(raw: string): MealHistoryEntry[] {
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    const entries: MealHistoryEntry[] = [];
    for (const item of data) {
      const parsed = mealHistoryEntrySchema.safeParse(item);
      if (parsed.success) entries.push(parsed.data);
    }
    return entries;
  } catch {
    return [];
  }
}

function sortNewestFirst(entries: MealHistoryEntry[]): MealHistoryEntry[] {
  return [...entries].sort(
    (a, b) => new Date(b.servedAt).getTime() - new Date(a.servedAt).getTime(),
  );
}

export function pruneHistory(
  entries: MealHistoryEntry[],
  maxEntries = MAX_HISTORY_ENTRIES,
): MealHistoryEntry[] {
  const sorted = sortNewestFirst(entries);
  return sorted.slice(0, maxEntries);
}

export function loadHistory(): MealHistoryEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const entries = sortNewestFirst(parseHistory(raw));
    const pruned = pruneHistory(entries);
    if (pruned.length !== entries.length) {
      persistHistory(pruned);
    }
    return pruned;
  } catch {
    return [];
  }
}

function persistHistory(entries: MealHistoryEntry[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pruneHistory(entries)));
}

export function appendHistoryEntry(
  entry: Omit<MealHistoryEntry, "id" | "servedAt"> & {
    id?: string;
    servedAt?: string;
  },
): MealHistoryEntry {
  const full: MealHistoryEntry = {
    id: entry.id ?? crypto.randomUUID(),
    servedAt: entry.servedAt ?? new Date().toISOString(),
    meal: entry.meal,
    inputs: entry.inputs,
    recipe: entry.recipe,
  };
  const next = pruneHistory([full, ...loadHistory()]);
  persistHistory(next);
  return full;
}

export function getHistoryEntry(id: string): MealHistoryEntry | undefined {
  return loadHistory().find((e) => e.id === id);
}

export function removeHistoryEntry(id: string): void {
  persistHistory(loadHistory().filter((e) => e.id !== id));
}

export function clearHistory(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getAvoidTitles(
  meal: MealType,
  options: GetAvoidTitlesOptions = {},
): string[] {
  const limit = options.limit ?? AVOID_TITLE_LIMIT;
  const withinDays = options.withinDays ?? AVOID_WITHIN_DAYS;
  const cutoff = Date.now() - withinDays * 24 * 60 * 60 * 1000;

  const seen = new Set<string>();
  const titles: string[] = [];

  for (const entry of loadHistory()) {
    if (entry.meal !== meal) continue;
    if (new Date(entry.servedAt).getTime() < cutoff) continue;

    const title = entry.recipe.title.trim();
    if (!title) continue;

    const key = normalizeMealTitle(title);
    if (seen.has(key)) continue;
    seen.add(key);
    titles.push(title);

    if (titles.length >= limit) break;
  }

  return titles;
}

export function createHistoryEntry(
  meal: MealType,
  inputs: RecipeInputs,
  recipe: RecipeResponse,
): MealHistoryEntry {
  return appendHistoryEntry({ meal, inputs, recipe });
}
