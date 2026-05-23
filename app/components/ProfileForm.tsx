"use client";

import { cmToFeetInches, feetInchesToCm } from "@/lib/height-units";
import type { UserProfile } from "@/lib/schemas";
import { inputClass, labelClass } from "@/lib/ui";

function IconMale({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="24" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M24 21v8M14 32l10-3 10 3M24 29v18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 47h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconFemale({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="24" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M24 19v6M16 28c2-6 14-6 16 0l-2 20H18L16 28z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M20 48h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GenderPicker({
  value,
  onChange,
}: {
  value: UserProfile["gender"];
  onChange: (g: UserProfile["gender"]) => void;
}) {
  const baseCard =
    "flex flex-1 flex-col items-center gap-2 rounded-xl border-2 px-4 py-3 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/35 sm:min-w-[7.5rem]";
  const inactive =
    "border-stone-200/90 bg-white text-stone-600 hover:border-stone-300 dark:border-stone-600 dark:bg-stone-900/40 dark:text-stone-400 dark:hover:border-stone-500";
  const active =
    "border-amber-800 bg-amber-50 text-amber-950 shadow-sm dark:border-amber-600 dark:bg-amber-950/50 dark:text-amber-100";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onChange("male")}
          aria-pressed={value === "male"}
          className={`${baseCard} ${value === "male" ? active : inactive}`}
        >
          <IconMale className="h-11 w-11" />
          <span className="text-sm font-semibold">Male</span>
        </button>
        <button
          type="button"
          onClick={() => onChange("female")}
          aria-pressed={value === "female"}
          className={`${baseCard} ${value === "female" ? active : inactive}`}
        >
          <IconFemale className="h-11 w-11" />
          <span className="text-sm font-semibold">Female</span>
        </button>
      </div>
      <button
        type="button"
        onClick={() => onChange("unspecified")}
        aria-pressed={value === "unspecified"}
        className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/35 ${
          value === "unspecified"
            ? "border-amber-800/60 bg-amber-50/80 font-medium text-amber-950 dark:border-amber-600/50 dark:bg-amber-950/35 dark:text-amber-100"
            : "border-stone-200/80 bg-stone-50/80 text-stone-600 hover:bg-stone-100 dark:border-stone-600 dark:bg-stone-800/50 dark:text-stone-400"
        }`}
      >
        Prefer not to say
      </button>
    </div>
  );
}

const dietTypeOptions: { value: UserProfile["dietType"]; label: string }[] = [
  { value: "veg", label: "Vegetarian" },
  { value: "non_veg", label: "Non-vegetarian" },
  { value: "other", label: "Other" },
];

const activityOptions: { value: UserProfile["activityLevel"]; label: string }[] =
  [
    { value: "sedentary", label: "Mostly seated day-to-day" },
    { value: "light", label: "Light movement (1–3 days / week)" },
    { value: "moderate", label: "Moderate (3–5 days / week)" },
    { value: "active", label: "Active (most days)" },
    { value: "very_active", label: "Very active / intense training" },
  ];

type Props = {
  profile: UserProfile;
  onChange: (p: UserProfile) => void;
  onSave: () => void;
  compact?: boolean;
};

function BodyMetricsFields({
  profile,
  onChange,
}: {
  profile: UserProfile;
  onChange: (p: UserProfile) => void;
}) {
  const unit = profile.heightUnit;
  const { feet, inches } = cmToFeetInches(profile.heightCm);

  const segBase =
    "rounded-md px-2 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/35";
  const segOn =
    "bg-amber-900 text-amber-50 dark:bg-amber-700 dark:text-amber-50";
  const segOff =
    "text-stone-600 hover:bg-stone-200/80 dark:text-stone-400 dark:hover:bg-stone-700/80";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="flex min-h-7 flex-wrap items-center gap-1.5">
        <span className={labelClass}>Height</span>
        <div
          className="inline-flex rounded-lg border border-stone-200/90 bg-stone-100/80 p-0.5 dark:border-stone-600 dark:bg-stone-800/80"
          role="group"
          aria-label="Height unit"
        >
          <button
            type="button"
            className={`${segBase} ${unit === "cm" ? segOn : segOff}`}
            aria-pressed={unit === "cm"}
            onClick={() => onChange({ ...profile, heightUnit: "cm" })}
          >
            cm
          </button>
          <button
            type="button"
            className={`${segBase} ${unit === "imperial" ? segOn : segOff}`}
            aria-pressed={unit === "imperial"}
            onClick={() => onChange({ ...profile, heightUnit: "imperial" })}
          >
            ft/in
          </button>
        </div>
        </div>
        <div className="flex min-h-7 items-center">
          <span className={labelClass}>Weight (kg)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 items-start sm:gap-4">
        <div className="min-w-0">
      {unit === "cm" ? (
        <input
          type="number"
          min={1}
          step={0.1}
          className={inputClass}
          aria-label="Height in centimetres"
          value={profile.heightCm || ""}
          onChange={(e) =>
            onChange({
              ...profile,
              heightCm: parseFloat(e.target.value) || 0,
            })
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Ft
            </span>
            <input
              type="number"
              min={0}
              max={8}
              step={1}
              className={inputClass}
              value={
                profile.heightCm <= 0 && feet === 0 && inches === 0
                  ? ""
                  : feet
              }
              onChange={(e) => {
                const f = parseInt(e.target.value, 10) || 0;
                const { inches: inc } = cmToFeetInches(profile.heightCm);
                onChange({
                  ...profile,
                  heightCm: feetInchesToCm(f, inc),
                });
              }}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
              In
            </span>
            <input
              type="number"
              min={0}
              max={11.99}
              step={0.25}
              className={inputClass}
              value={
                profile.heightCm <= 0 && feet === 0 && inches === 0
                  ? ""
                  : inches
              }
              onChange={(e) => {
                const i = parseFloat(e.target.value) || 0;
                const { feet: ft } = cmToFeetInches(profile.heightCm);
                onChange({
                  ...profile,
                  heightCm: feetInchesToCm(ft, i),
                });
              }}
            />
          </label>
        </div>
      )}
        </div>
        <div className="min-w-0">
          <input
            type="number"
            min={1}
            step={0.1}
            className={inputClass}
            aria-label="Weight in kilograms"
            value={profile.weightKg || ""}
            onChange={(e) =>
              onChange({
                ...profile,
                weightKg: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

export function ProfileForm({
  profile,
  onChange,
  onSave,
  compact = false,
}: Props) {
  const gap = compact ? "gap-5" : "gap-7";

  return (
    <div className={`flex flex-col ${gap}`}>
      <div>
        <span className={labelClass}>Gender</span>
        {!compact ? (
          <p className="mb-3 mt-1.5 text-xs leading-relaxed text-stone-500 dark:text-stone-500">
            Optional for tailoring portions and nutrition estimates.
          </p>
        ) : null}
        <GenderPicker
          value={profile.gender}
          onChange={(gender) => onChange({ ...profile, gender })}
        />
      </div>
      <BodyMetricsFields profile={profile} onChange={onChange} />
      <div className="flex flex-col gap-2">
        <label htmlFor="profile-diet-type" className={labelClass}>
          Diet
        </label>
        <select
          id="profile-diet-type"
          className={inputClass}
          value={profile.dietType}
          onChange={(e) => {
            const dietType = e.target.value as UserProfile["dietType"];
            onChange({
              ...profile,
              dietType,
              dietOther: dietType === "other" ? profile.dietOther : "",
            });
          }}
        >
          {dietTypeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {profile.dietType === "other" ? (
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
              Describe your diet
            </span>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. gluten free, vegan, no onion or garlic…"
              value={profile.dietOther}
              onChange={(e) =>
                onChange({ ...profile, dietOther: e.target.value })
              }
            />
          </label>
        ) : null}
      </div>
      <label className="flex flex-col gap-2">
        <span className={labelClass}>Your goals</span>
        <textarea
          rows={3}
          placeholder="For example: steadier energy, gentler blood pressure, more protein, or weight you feel good at…"
          className={`${inputClass} min-h-[5.5rem] resize-y`}
          value={profile.goals}
          onChange={(e) => onChange({ ...profile, goals: e.target.value })}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className={labelClass}>Typical activity</span>
        <select
          className={inputClass}
          value={profile.activityLevel}
          onChange={(e) =>
            onChange({
              ...profile,
              activityLevel: e.target.value as UserProfile["activityLevel"],
            })
          }
        >
          {activityOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={onSave}
        className="w-fit rounded-full border border-stone-300 bg-stone-100 px-6 py-2.5 text-sm font-semibold text-stone-800 transition hover:bg-stone-200 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700"
      >
        Save on this device
      </button>
      {!compact ? (
        <p className="text-xs leading-relaxed text-stone-500 dark:text-stone-500">
          We keep this only in your browser. It is not sent anywhere until you
          ask for a recipe—and even then, we use it only to shape the suggestion.
        </p>
      ) : null}
    </div>
  );
}
