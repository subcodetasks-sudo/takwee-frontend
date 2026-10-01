"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link } from "@/i18n/routing";
import { useHomePage } from "../hooks/useHomePage";
import type { CategoryItem } from "../types";
import { cn } from "@/lib/utils";

function CategoryButton({
  category,
  index,
}: {
  category: CategoryItem;
  index: number;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.li
      key={category.id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full flex justify-center"
    >
      <Link
        href={category.href}
        className={cn(
          "group flex flex-col items-center gap-2.5 sm:gap-3 w-full max-w-[135px] sm:max-w-[160px] md:max-w-[185px] lg:max-w-[210px] text-center",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl p-1",
        )}
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-full bg-muted ring-1 ring-border/60 transition-all duration-300 group-hover:ring-2 group-hover:ring-primary/60 group-hover:shadow-lg">
          {!imageLoaded && (
            <div className="absolute inset-0 z-10 rounded-full bg-muted/70 animate-pulse" />
          )}
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 220px"
              className={cn(
                "object-cover object-center transition-all duration-500 ease-out group-hover:scale-110",
                imageLoaded ? "opacity-100" : "opacity-0",
              )}
            />
          ) : null}
        </div>
        <div className="px-1 text-center">
          <h3 className="text-xs sm:text-sm md:text-base font-medium tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary line-clamp-2">
            {category.name}
          </h3>
        </div>
      </Link>
    </motion.li>
  );
}

export function CategoriesSection() {
  const t = useTranslations("Categories");
  const { categories, isLoading, isPending, isFetching, isSuccess } =
    useHomePage();

  const isCategoriesLoading =
    (isLoading || isPending || isFetching) && categories.length === 0;

  if (isCategoriesLoading) {
    return (
      <section
        className="page-shell relative w-full overflow-hidden bg-background py-8 sm:py-12"
        aria-busy="true"
        aria-label={t("loading")}
      >
        <ul className="grid grid-cols-3 gap-4 sm:gap-6 lg:grid-cols-6 lg:gap-8 list-none p-0 m-0">
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={index} className="w-full flex flex-col items-center gap-2.5 sm:gap-3">
              <div className="aspect-square w-full max-w-[135px] sm:max-w-[160px] md:max-w-[185px] lg:max-w-[210px] rounded-full animate-pulse bg-muted/60 ring-1 ring-border/40" />
              <div className="mx-auto h-3.5 sm:h-4 w-16 sm:w-20 rounded bg-muted animate-pulse" />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (isSuccess && categories.length === 0) {
    return null;
  }

  // Dynamically size grid columns when there are fewer categories so cards expand and fill the container nicely
  const getGridColsClass = (count: number) => {
    switch (count) {
      case 1:
        return "grid-cols-1 max-w-[210px] mx-auto";
      case 2:
        return "grid-cols-2 max-w-sm sm:max-w-md mx-auto gap-6 sm:gap-8";
      case 3:
        return "grid-cols-3 max-w-md sm:max-w-2xl mx-auto";
      case 4:
        return "grid-cols-2 sm:grid-cols-4 max-w-4xl mx-auto";
      case 5:
        return "grid-cols-3 sm:grid-cols-5";
      default:
        return "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6";
    }
  };

  const gridCols = getGridColsClass(categories.length);

  return (
    <section className="page-shell relative w-full overflow-hidden bg-background py-8 sm:py-12">
      <ul
        className={cn(
          "grid gap-4 sm:gap-6 lg:gap-8 list-none p-0 m-0",
          gridCols,
        )}
      >
        {categories.map((category, index) => (
          <CategoryButton key={category.id} category={category} index={index} />
        ))}
      </ul>
    </section>
  );
}
