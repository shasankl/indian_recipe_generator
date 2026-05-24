import Link from "next/link";
import { APP_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-stone-200/80 px-4 py-6 dark:border-stone-700/80">
      <nav
        className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-stone-600 dark:text-stone-400"
        aria-label="Legal and support"
      >
        <Link href="/privacy" className="hover:text-stone-900 dark:hover:text-stone-200">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-stone-900 dark:hover:text-stone-200">
          Terms
        </Link>
        <Link href="/support" className="hover:text-stone-900 dark:hover:text-stone-200">
          Support
        </Link>
      </nav>
      <p className="mx-auto mt-3 max-w-2xl text-center text-xs text-stone-500 dark:text-stone-500">
        © {new Date().getFullYear()} {APP_NAME}. Recipe suggestions are for general
        wellness only—not medical advice.
      </p>
    </footer>
  );
}
