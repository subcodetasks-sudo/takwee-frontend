export type FlyRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type FlyToCartPayload = {
  origin: DOMRect | HTMLElement;
  imageUrl: string;
  alt?: string;
};

const DEFAULT_ORIGIN_SIZE = 48;
const LANDING_SIZE = 20;
const ARC_LIFT_PX = 56;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function resolveOriginRect(
  origin: DOMRect | HTMLElement,
  size = DEFAULT_ORIGIN_SIZE,
): FlyRect {
  const rect =
    origin instanceof HTMLElement ? origin.getBoundingClientRect() : origin;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return {
    left: cx - size / 2,
    top: cy - size / 2,
    width: size,
    height: size,
  };
}

export function resolveTargetRect(
  target: HTMLElement,
  size = LANDING_SIZE,
): FlyRect {
  const rect = target.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return {
    left: cx - size / 2,
    top: cy - size / 2,
    width: size,
    height: size,
  };
}

/** True when the cart control is at least partially on-screen (and has layout). */
export function isCartTargetVisible(rect: DOMRect | FlyRect): boolean {
  const width = "width" in rect ? rect.width : 0;
  const height = "height" in rect ? rect.height : 0;
  if (width <= 0 || height <= 0) return false;

  const left = rect.left;
  const top = rect.top;
  const right = left + width;
  const bottom = top + height;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  return bottom > 0 && top < vh && right > 0 && left < vw;
}

export function buildArcMidpoint(from: FlyRect, to: FlyRect): FlyRect {
  const midWidth = (from.width + to.width) / 2;
  const midHeight = (from.height + to.height) / 2;
  return {
    left: (from.left + to.left) / 2,
    top: Math.min(from.top, to.top) - ARC_LIFT_PX,
    width: midWidth,
    height: midHeight,
  };
}

export const FLY_TO_CART_DURATION_S = 0.75;
export const FLY_TO_CART_EASE = [0.22, 1, 0.36, 1] as const;
