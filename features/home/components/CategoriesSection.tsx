"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link } from "@/i18n/routing";
import { HOME_CATEGORIES } from "../utils/categories";
import { cn } from "@/lib/utils";

export function CategoriesSection() {
  const t = useTranslations("Categories");

  return (
    <section className="page-shell relative w-full overflow-hidden bg-background py-8 sm:py-10">
        <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 lg:gap-6 list-none p-0 m-0">
          {HOME_CATEGORIES.map((category, index) => (
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
              className="w-36 sm:w-40"
            >
              <Link
                href={category.href}
                className={cn(
                  "group flex flex-col overflow-hidden rounded-2xl bg-card",
                  "ring-1 ring-border/60 transition-shadow duration-300",
                  "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={category.image}
                    alt={t(category.titleKey)}
                    fill
                    sizes="160px"
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="px-2.5 py-2.5 text-center">
                  <h3 className="text-xs sm:text-sm font-medium tracking-tight text-foreground line-clamp-2">
                    {t(category.titleKey)}
                  </h3>
                </div>
              </Link>
            </motion.li>
        ))}
      </ul>
    </section>
  );
}
