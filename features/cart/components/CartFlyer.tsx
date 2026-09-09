"use client";

import { motion } from "motion/react";
import {
  buildArcMidpoint,
  FLY_TO_CART_DURATION_S,
  FLY_TO_CART_EASE,
  type FlyRect,
} from "../utils/fly-to-cart";

export type CartFlyerProps = {
  id: string;
  imageUrl: string;
  alt?: string;
  from: FlyRect;
  to: FlyRect;
  onComplete: (id: string) => void;
};

export function CartFlyer({
  id,
  imageUrl,
  alt = "",
  from,
  to,
  onComplete,
}: CartFlyerProps) {
  const mid = buildArcMidpoint(from, to);

  return (
    <motion.img
      src={imageUrl}
      alt={alt}
      aria-hidden
      initial={{
        left: from.left,
        top: from.top,
        width: from.width,
        height: from.height,
        opacity: 1,
        borderRadius: 8,
      }}
      animate={{
        left: [from.left, mid.left, to.left],
        top: [from.top, mid.top, to.top],
        width: [from.width, mid.width, to.width],
        height: [from.height, mid.height, to.height],
        opacity: [1, 1, 0.75],
        borderRadius: [8, 12, 999],
      }}
      transition={{
        duration: FLY_TO_CART_DURATION_S,
        times: [0, 0.45, 1],
        ease: FLY_TO_CART_EASE,
      }}
      onAnimationComplete={() => onComplete(id)}
      className="pointer-events-none fixed z-[90] object-cover shadow-md ring-1 ring-border/40"
      style={{ position: "fixed" }}
    />
  );
}
