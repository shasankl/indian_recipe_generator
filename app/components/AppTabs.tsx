"use client";

export type AppTab = "request" | "history";

type Tab = {
  id: AppTab;
  label: string;
  badge?: number;
};

type Props = {
  active: AppTab;
  onChange: (tab: AppTab) => void;
  tabs: Tab[];
};

export function AppTabs({ active, onChange, tabs }: Props) {
  return (
    <div
      className="mt-8 flex gap-1 rounded-xl border border-stone-200/90 bg-stone-100/80 p-1 dark:border-stone-700 dark:bg-stone-800/60"
      role="tablist"
      aria-label="Main sections"
    >
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/40 ${
              selected
                ? "bg-white text-stone-900 shadow-sm dark:bg-stone-900 dark:text-stone-50"
                : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
            }`}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 ? (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${
                  selected
                    ? "bg-amber-900 text-amber-50 dark:bg-amber-700"
                    : "bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-200"
                }`}
              >
                {tab.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
