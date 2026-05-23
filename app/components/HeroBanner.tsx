import Image from "next/image";

const HERO_SRC = "/indian_food_image.jpg";

export function HeroBanner() {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-stone-200/60 shadow-md shadow-stone-300/20 dark:border-stone-700/60 dark:shadow-black/30 sm:aspect-[2/1] lg:aspect-[4/3]">
      <Image
        src={HERO_SRC}
        alt="Colourful Indian home-style food on a table"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 420px"
        className="object-cover"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/30 via-stone-900/5 to-transparent dark:from-stone-950/50"
        aria-hidden
      />
    </div>
  );
}
