"use client";

import { useEffect, useState } from "react";
import { ProfileForm } from "@/app/components/ProfileForm";
import { RecipeForm } from "@/app/components/RecipeForm";
import { RecipeResult } from "@/app/components/RecipeResult";
import { loadProfile, persistProfile } from "@/lib/profile-storage";
import {
  recipeRequestSchema,
  type RecipeInputs,
  type RecipeResponse,
  type UserProfile,
} from "@/lib/schemas";

type Tab = "profile" | "recipe";

function LoadingShell() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-stone-200/70 bg-white/80 p-8 shadow-lg shadow-stone-300/30 dark:border-stone-700 dark:bg-stone-900/70 dark:shadow-black/40">
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-stone-200 dark:bg-stone-700" />
        <div className="h-3 w-full animate-pulse rounded-full bg-stone-100 dark:bg-stone-800" />
        <div className="h-3 w-5/6 animate-pulse rounded-full bg-stone-100 dark:bg-stone-800" />
        <p className="pt-2 text-center text-sm text-stone-500 dark:text-stone-400">
          Opening your kitchen…
        </p>
      </div>
    </div>
  );
}

function AlertIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-red-700 dark:text-red-400"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-amber-800/30 border-t-amber-800 dark:border-amber-500/30 dark:border-t-amber-400"
      aria-hidden
    />
  );
}

export function HomeClient() {
  const [tab, setTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveHint, setSaveHint] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage after mount (avoids SSR/client mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage
    setProfile(loadProfile());
  }, []);

  if (!profile) {
    return <LoadingShell />;
  }

  function handleSaveProfile() {
    if (!profile) return;
    persistProfile(profile);
    setSaveHint(true);
    window.setTimeout(() => setSaveHint(false), 2500);
  }

  async function handleRecipeRequest(inputs: RecipeInputs) {
    setError(null);
    setRecipe(null);
    const payload = { profile, inputs };
    const valid = recipeRequestSchema.safeParse(payload);
    if (!valid.success) {
      const fieldErrors = valid.error.flatten().fieldErrors;
      const first =
        Object.values(fieldErrors).flat()[0] ??
        "Please add height, weight, and a short note on your goals.";
      setError(first);
      setTab("profile");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valid.data),
      });
      const data = (await res.json()) as
        | { recipe: RecipeResponse; error?: string }
        | { error: string; details?: unknown };

      if (!res.ok) {
        setError(
          "error" in data && typeof data.error === "string"
            ? data.error
            : "Something went wrong. Please try again.",
        );
        return;
      }
      if ("recipe" in data && data.recipe) {
        setRecipe(data.recipe);
      }
    } catch {
      setError("We could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 lg:max-w-3xl">
      <div className="rounded-2xl border border-stone-200/70 bg-white/85 px-5 py-8 shadow-xl shadow-stone-300/25 backdrop-blur-sm sm:px-8 sm:py-10 dark:border-stone-700/70 dark:bg-stone-900/75 dark:shadow-black/50">
        <header className="mb-8 border-b border-stone-200/80 pb-8 dark:border-stone-700/80">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-900/80 dark:text-amber-500/90">
            Rasoi
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-50">
            Recipes that fit your life
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
            Save your details once. Then ask for a sensible home-style idea—
            with your time and tastes in mind.
          </p>
        </header>

        <div
          className="flex w-full flex-col gap-2 sm:flex-row sm:items-stretch"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "profile"}
            onClick={() => setTab("profile")}
            className={`flex flex-1 flex-col rounded-xl px-4 py-3 text-left transition ${
              tab === "profile"
                ? "bg-amber-900 text-white shadow-md shadow-amber-900/25 dark:bg-amber-700 dark:shadow-amber-900/30"
                : "bg-stone-100/90 text-stone-700 hover:bg-stone-200/90 dark:bg-stone-800/80 dark:text-stone-300 dark:hover:bg-stone-800"
            }`}
          >
            <span className="text-sm font-semibold">Your details</span>
            <span
              className={`mt-0.5 text-xs font-normal ${
                tab === "profile"
                  ? "text-amber-100/90"
                  : "text-stone-500 dark:text-stone-500"
              }`}
            >
              Step 1 of 2 — height, weight, goals
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "recipe"}
            onClick={() => setTab("recipe")}
            className={`flex flex-1 flex-col rounded-xl px-4 py-3 text-left transition ${
              tab === "recipe"
                ? "bg-amber-900 text-white shadow-md shadow-amber-900/25 dark:bg-amber-700 dark:shadow-amber-900/30"
                : "bg-stone-100/90 text-stone-700 hover:bg-stone-200/90 dark:bg-stone-800/80 dark:text-stone-300 dark:hover:bg-stone-800"
            }`}
          >
            <span className="text-sm font-semibold">Request a recipe</span>
            <span
              className={`mt-0.5 text-xs font-normal ${
                tab === "recipe"
                  ? "text-amber-100/90"
                  : "text-stone-500 dark:text-stone-500"
              }`}
            >
              Step 2 of 2 — meal and preferences
            </span>
          </button>
        </div>

        <div className="mt-8">
          {tab === "profile" ? (
            <div>
              {saveHint ? (
                <p className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-200">
                  <span className="text-base" aria-hidden>
                    ✓
                  </span>
                  Saved on this device. We will use it for your next recipe.
                </p>
              ) : null}
              <ProfileForm
                profile={profile}
                onChange={setProfile}
                onSave={handleSaveProfile}
              />
            </div>
          ) : (
            <RecipeForm
              profile={profile}
              disabled={loading}
              onSubmit={handleRecipeRequest}
            />
          )}
        </div>

        {error ? (
          <div
            className="mt-6 flex gap-3 rounded-xl border border-red-200/90 bg-red-50/95 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100"
            role="alert"
          >
            <AlertIcon />
            <p className="leading-relaxed">{error}</p>
          </div>
        ) : null}

        {loading ? (
          <div className="mt-6 flex items-center gap-3 text-sm text-stone-600 dark:text-stone-400">
            <Spinner />
            <span className="leading-relaxed">
              Preparing your recipe—this usually takes a few seconds.
            </span>
          </div>
        ) : null}

        {recipe ? <RecipeResult recipe={recipe} /> : null}
      </div>
    </div>
  );
}
