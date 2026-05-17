"use client";

import type { RecipeResponse } from "@/lib/schemas";

const sectionHeadingClass =
  "text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400";

type Props = {
  recipe: RecipeResponse;
};

function MacroChip({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="rounded-full border border-amber-200/90 bg-amber-50/90 px-3.5 py-1.5 text-center dark:border-amber-800/50 dark:bg-amber-950/45">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-900/80 dark:text-amber-200/90">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-stone-900 dark:text-stone-100">
        {value}
        {unit ? (
          <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
            {" "}
            {unit}
          </span>
        ) : null}
      </p>
    </div>
  );
}

export function RecipeResult({ recipe }: Props) {
  return (
    <article className="mt-10 overflow-hidden rounded-2xl border border-stone-200/80 bg-gradient-to-b from-white to-stone-50/90 shadow-lg shadow-stone-300/20 dark:border-stone-700 dark:from-stone-900 dark:to-stone-950 dark:shadow-black/40">
      <div className="border-b border-stone-200/80 bg-amber-900/95 px-6 py-5 dark:border-stone-700 dark:bg-amber-950/90">
        <h2 className="text-xl font-semibold leading-snug text-amber-50 sm:text-2xl">
          {recipe.title}
        </h2>
        <p className="mt-2 text-xs font-medium uppercase tracking-wider text-amber-200/90">
          Approximate nutrition per serving
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <MacroChip label="Energy" value={recipe.macros.calories} unit="kcal" />
          <MacroChip label="Protein" value={recipe.macros.protein_g} unit="g" />
          <MacroChip label="Carbs" value={recipe.macros.carbs_g} unit="g" />
          <MacroChip label="Fat" value={recipe.macros.fat_g} unit="g" />
        </div>
      </div>

      <div className="grid gap-8 p-6 sm:grid-cols-2 sm:gap-10 sm:p-8">
        <section>
          <h3 className={sectionHeadingClass}>Ingredients</h3>
          <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-stone-800 dark:text-stone-200">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex gap-2 border-b border-stone-100 pb-2.5 last:border-0 dark:border-stone-800/80">
                <span className="font-medium text-stone-900 dark:text-stone-100">
                  {ing.item}
                </span>
                {ing.amount ? (
                  <span className="text-stone-600 dark:text-stone-400">
                    {ing.amount}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
        <section className="sm:pl-2">
          <h3 className={sectionHeadingClass}>Method</h3>
          <ol className="mt-4 space-y-4">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-900 text-sm font-semibold text-amber-50 dark:bg-amber-700"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <p className="pt-1 text-[15px] leading-relaxed text-stone-800 dark:text-stone-200">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {recipe.notes ? (
        <p className="border-t border-stone-200/80 bg-stone-50/80 px-6 py-4 text-sm leading-relaxed text-stone-700 dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-300 sm:px-8">
          <span className="font-medium text-stone-800 dark:text-stone-200">
            Note:{" "}
          </span>
          {recipe.notes}
        </p>
      ) : null}
    </article>
  );
}
