import { HomeClient } from "@/app/components/HomeClient";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-amber-50/95 via-stone-100/90 to-amber-100/40 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <HomeClient />
    </div>
  );
}
