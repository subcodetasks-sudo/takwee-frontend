"use client";

import { useTranslations } from "next-intl";
import { Heart } from "@/components/animate-ui/icons/heart";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useProductDetails } from "../context/ProductDetailsContext";

export function ProductDetailsWishlistButton() {
  const t = useTranslations("ProductDetails");
  const context = useProductDetails();

  if (!context) return null;

  const { isWishlisted, handleToggleWishlist } = context;

  return (
    <AnimateIcon animateOnTap>
      <TooltipProvider delay={100}>
        <Tooltip>
          <TooltipTrigger
            type="button"
            onClick={handleToggleWishlist}
            aria-label={
              isWishlisted ? t("removeFromWishlist") : t("addToWishlist")
            }
            aria-pressed={isWishlisted}
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full",
              "border border-border/70 bg-card text-foreground shadow-sm",
              "transition-colors duration-200 outline-none cursor-pointer",
              "hover:bg-muted hover:text-error",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              isWishlisted && "border-error/30 text-error",
            )}
          >
            <Heart
              className={cn(
                "size-4.5 transition-colors",
                isWishlisted && "fill-error stroke-error",
              )}
            />
          </TooltipTrigger>
          <TooltipContent
            side="inline-start"
            sideOffset={6}
            className="text-xs font-medium"
          >
            {isWishlisted ? t("removeFromWishlist") : t("addToWishlist")}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </AnimateIcon>
  );
}
