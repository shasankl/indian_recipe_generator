"use client";

import type { RefObject } from "react";
import { RecipeResult } from "@/app/components/RecipeResult";
import { MAX_HISTORY_ENTRIES } from "@/lib/meal-history-storage";
import type { MealHistoryEntry, RecipeResponse } from "@/lib/schemas";
import { labelClass } from "@/lib/ui";

const MEAL_LABEL: Record<MealHistoryEntry["meal"], string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  evening_snack: "Evening snack",
};

function formatServedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type Props = {
  entries: MealHistoryEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDeselect: () => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  /** When set, show RecipeResult below the list for the selected entry. */
  viewingRecipe?: RecipeResponse | null;
  recipeRef?: RefObject<HTMLDivElement | null>;
};

export function MealHistoryPanel({
  entries,
  selectedId,
  onSelect,
  onDeselect,
  onRemove,
  onClearAll,
  viewingRecipe,
  recipeRef,
}: Props) {
  if (entries.length === 0) {
    return (
      <section>
        <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
          Recipes you generate will appear here so you can open them again. We
          keep your last {MAX_HISTORY_ENTRIES} meals to suggest more variety,
          then drop the oldest.
        </p>
      </section>
    );
  }

  function handleClearAll() {
    if (
      window.confirm(
        "Clear all meal history? This cannot be undone and future suggestions will not avoid past dishes.",
      )
    ) {
      onClearAll();
    }
  }

  function handleRemove(id: string, title: string) {
    if (window.confirm(`Remove “${title}” from your history?`)) {
      onRemove(id);
    }
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            {entries.length} of {MAX_HISTORY_ENTRIES} saved — tap to open, tap again to close
          </p>
        </div>
        <button
          type="button"
          onClick={handleClearAll}
          className="text-sm font-medium text-stone-600 underline-offset-2 hover:text-stone-900 hover:underline dark:text-stone-400 dark:hover:text-stone-200"
        >
          Clear all
        </button>
      </div>

      <p className={`mt-4 ${labelClass}`}>Recent meals</p>
      <ul className="mt-3 space-y-2">
        {entries.map((entry) => {
          const selected = entry.id === selectedId;
          return (
            <li key={entry.id}>
              <div
                className={`flex items-stretch gap-1 rounded-xl border transition ${
                  selected
                    ? "border-amber-700/50 bg-amber-50/80 dark:border-amber-600/40 dark:bg-amber-950/35"
                    : "border-stone-200/90 bg-white/70 dark:border-stone-700 dark:bg-stone-900/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(entry.id)}
                  className="min-w-0 flex-1 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/40 focus-visible:ring-inset"
                >
                  <p className="truncate font-medium text-stone-900 dark:text-stone-100">
                    {entry.recipe.title}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                      {MEAL_LABEL[entry.meal]}
                    </span>
                    <span>{formatServedAt(entry.servedAt)}</span>
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(entry.id, entry.recipe.title)}
                  className="shrink-0 px-3 text-stone-500 hover:text-red-700 dark:text-stone-400 dark:hover:text-red-400"
                  aria-label={`Remove ${entry.recipe.title} from history`}
                >
                  <span aria-hidden>×</span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {viewingRecipe ? (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onDeselect}
              className="rounded-full border border-stone-300 bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-800 transition hover:bg-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/40 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700"
            >
              Hide recipe
            </button>
          </div>
          <div ref={recipeRef}>
            <RecipeResult recipe={viewingRecipe} />
          </div>
        </div>
      ) : (
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Select a meal above to view the full recipe.
        </p>
      )}
    </section>
  );
}
