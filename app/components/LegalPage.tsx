import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export function LegalPage({ title, children }: Props) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/"
        className="text-sm font-medium text-amber-900 hover:underline dark:text-amber-400"
      >
        ← Back to Rasoi
      </Link>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
        {title}
      </h1>
      <div className="prose prose-stone mt-8 max-w-none text-[15px] leading-relaxed dark:prose-invert prose-headings:font-semibold prose-p:text-stone-700 dark:prose-p:text-stone-300 prose-li:text-stone-700 dark:prose-li:text-stone-300">
        {children}
      </div>
    </div>
  );
}
