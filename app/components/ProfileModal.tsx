"use client";

import { useEffect, useRef } from "react";
import { ProfileForm } from "@/app/components/ProfileForm";
import type { UserProfile } from "@/lib/schemas";

type Props = {
  open: boolean;
  onClose: () => void;
  profile: UserProfile;
  onChange: (p: UserProfile) => void;
  onSave: () => void;
  saveHint: boolean;
};

export function ProfileModal({
  open,
  onClose,
  profile,
  onChange,
  onSave,
  saveHint,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickedBackdrop =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (clickedBackdrop) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 m-0 max-h-none max-w-none border-0 bg-transparent p-4 backdrop:bg-stone-950/50 backdrop:backdrop-blur-sm open:flex open:items-center open:justify-center"
      aria-labelledby="profile-dialog-title"
    >
      <div
        className="flex max-h-[min(90vh,48rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-2xl shadow-stone-900/20 dark:border-stone-700 dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-stone-200/80 px-5 py-4 dark:border-stone-700">
          <div>
            <h2
              id="profile-dialog-title"
              className="text-lg font-semibold text-stone-900 dark:text-stone-50"
            >
              Your profile
            </h2>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
              Used to tailor recipes to you. Saved only on this device.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-800 dark:hover:bg-stone-800 dark:hover:text-stone-200"
            aria-label="Close profile"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5">
          {saveHint ? (
            <p className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-200">
              <span aria-hidden>✓</span>
              Saved on this device. We will use it for your next recipe.
            </p>
          ) : null}
          <ProfileForm
            profile={profile}
            onChange={onChange}
            onSave={onSave}
          />
        </div>
      </div>
    </dialog>
  );
}
