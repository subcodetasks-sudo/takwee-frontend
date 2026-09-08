"use client";

import Image from "next/image";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface CountryFlagProps {
  code: string;
  emoji?: string;
  className?: string;
}

export function CountryFlag({ code, emoji, className }: CountryFlagProps) {
  const [hasError, setHasError] = useState(false);
  const cleanCode = (code || "").trim().toLowerCase();

  if (!cleanCode || hasError) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center text-xs font-mono font-bold leading-none shrink-0",
          className
        )}
        aria-hidden
      >
        {emoji || code.toUpperCase() || "🌐"}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center shrink-0 overflow-hidden rounded-[2px] border border-border/40 bg-muted/40 shadow-2xs leading-none",
        className
      )}
    >
      <Image
        src={`https://flagcdn.com/w40/${cleanCode}.png`}
        alt=""
        width={20}
        height={14}
        onError={() => setHasError(true)}
        className="h-3.5 w-5 object-cover shrink-0 select-none pointer-events-none"
      />
    </span>
  );
}
