"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link } from "@/i18n/routing";
import { useHomePage } from "../hooks/useHomePage";
import { cn } from "@/lib/utils";

export function CategoriesSection() {
  const t = useTranslations("Categories");
  const { categories, isLoading } = useHomePage();

  if (isLoading && categories.length === 0) {
    return (
      <section
        className="page-shell relative w-full overflow-hidden bg-background py-8 sm:py-10"
        aria-busy="true"
        aria-label={t("loading")}
      >
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-6 list-none p-0 m-0">
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={index} className="w-full">
              <div className="overflow-hidden rounded-xl sm:rounded-2xl bg-muted/50 ring-1 ring-border/40">
                <div className="aspect-square w-full animate-pulse bg-muted" />
                <div className="px-2.5 py-2.5">
                  <div className="mx-auto h-3 w-16 rounded bg-muted animate-pulse" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="page-shell relative w-full overflow-hidden bg-background py-8 sm:py-10">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-6 list-none p-0 m-0">
        {categories.map((category, index) => (
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
            className="w-full"
          >
            <Link
              href={category.href}
              className={cn(
                "group flex flex-col overflow-hidden rounded-xl sm:rounded-2xl bg-card",
                "ring-1 ring-border/60 transition-shadow duration-300",
                "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <div className="relative aspect-square w-full overflow-hidden bg-muted">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : null}
              </div>
              <div className="px-2.5 py-2.5 text-center">
                <h3 className="text-xs sm:text-sm font-medium tracking-tight text-foreground line-clamp-2">
                  {category.name}
                </h3>
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
