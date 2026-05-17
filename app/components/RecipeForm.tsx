"use client";

import type { RecipeInputs } from "@/lib/schemas";
import { inputClass, labelClass } from "@/lib/ui";

type Props = {
  disabled?: boolean;
  onSubmit: (inputs: RecipeInputs) => void;
};

export function RecipeForm({ disabled, onSubmit }: Props) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const meal = fd.get("meal") as RecipeInputs["meal"];
    const preferences = String(fd.get("preferences") ?? "");
    const maxPrepMinutes = parseInt(String(fd.get("maxPrepMinutes")), 10);
    onSubmit({
      meal,
      preferences,
      maxPrepMinutes: Number.isFinite(maxPrepMinutes) ? maxPrepMinutes : 30,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <fieldset className="flex flex-col gap-3">
        <legend className={labelClass}>Which meal?</legend>
        <div className="flex flex-wrap gap-3">
          {(
            [
              ["breakfast", "Breakfast"],
              ["lunch", "Lunch"],
              ["dinner", "Dinner"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-sm text-stone-800 has-[:checked]:border-amber-800/50 has-[:checked]:bg-amber-50/80 dark:border-stone-600 dark:bg-stone-900/40 dark:text-stone-200 dark:has-[:checked]:border-amber-600/50 dark:has-[:checked]:bg-amber-950/40"
            >
              <input
                type="radio"
                name="meal"
                value={value}
                defaultChecked={value === "lunch"}
                className="h-4 w-4 accent-amber-800 dark:accent-amber-600"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex flex-col gap-2">
        <span className={labelClass}>Tastes & boundaries</span>
        <textarea
          name="preferences"
          rows={3}
          placeholder="Vegetarian or vegan, no nuts, less oil, mild spice, dishes you grew up with…"
          className={`${inputClass} min-h-[5.5rem] resize-y`}
        />
      </label>
      <label className="flex max-w-xs flex-col gap-2">
        <span className={labelClass}>Time you have (minutes)</span>
        <input
          type="number"
          name="maxPrepMinutes"
          min={5}
          max={240}
          defaultValue={45}
          className={inputClass}
        />
      </label>
      <button
        type="submit"
        disabled={disabled}
        className="w-fit rounded-full bg-amber-900 px-6 py-2.5 text-sm font-semibold text-amber-50 shadow-md shadow-amber-900/20 transition hover:bg-amber-950 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-amber-700 dark:text-amber-50 dark:hover:bg-amber-600"
      >
        Suggest a recipe
      </button>
    </form>
  );
}
