"use client";

import {
  CSSProperties,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

export type TextLoopShape = "wave" | "circle" | "infinity" | "arch" | "line";
export type TextLoopDirection = "forward" | "reverse";

export interface TextLoopProps {
  text?: string;
  shape?: TextLoopShape;
  path?: string;
  speed?: number;
  direction?: TextLoopDirection;
  separator?: string;
  curviness?: number;
  fontSize?: number;
  fontWeight?: number | string;
  letterSpacing?: number;
  uppercase?: boolean;
  color?: string;
  ribbon?: boolean;
  ribbonColor?: string;
  ribbonWidth?: number;
  pauseOnHover?: boolean;
  className?: string;
  style?: CSSProperties;
  dir?: "ltr" | "rtl";
  isRTL?: boolean;
}

interface Metrics {
  length: number;
  reps: number;
}

const VIEW_W = 1200;
const VIEW_H = 520;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2;
const EDGE_PAD = 6;

const buildPath = (
  shape: TextLoopShape,
  curviness: number,
  ribbonWidth: number,
): string => {
  const c = Math.max(0, curviness);
  const room = Math.max(20, CY - Math.max(0, ribbonWidth) / 2 - EDGE_PAD);

  switch (shape) {
    case "circle": {
      const r = Math.min(90 + c * 0.95, room);
      return `M ${CX - r} ${CY} A ${r} ${r} 0 1 1 ${CX + r} ${CY} A ${r} ${r} 0 1 1 ${CX - r} ${CY} Z`;
    }
    case "infinity": {
      const r = 150 + c * 1.4;
      const h = Math.min(60 + c * 0.95, room);
      return [
        `M ${CX} ${CY}`,
        `C ${CX + r * 0.55} ${CY - h} ${CX + r} ${CY - h} ${CX + r} ${CY}`,
        `C ${CX + r} ${CY + h} ${CX + r * 0.55} ${CY + h} ${CX} ${CY}`,
        `C ${CX - r * 0.55} ${CY - h} ${CX - r} ${CY - h} ${CX - r} ${CY}`,
        `C ${CX - r} ${CY + h} ${CX - r * 0.55} ${CY + h} ${CX} ${CY}`,
        "Z",
      ].join(" ");
    }
    case "arch": {
      const rise = Math.min(120 + c * 1.1, room * 2);
      return `M 120 ${CY + rise / 2} Q ${CX} ${CY - rise * 1.5} ${VIEW_W - 120} ${CY + rise / 2}`;
    }
    case "line":
      return `M -320 ${CY} L ${VIEW_W + 320} ${CY}`;
    case "wave":
    default: {
      const a = Math.min(c * 2.2, room * 2);
      return `M -320 ${CY} Q -160 ${CY - a} 0 ${CY} T 320 ${CY} T 640 ${CY} T 960 ${CY} T 1280 ${CY} T ${VIEW_W + 320} ${CY}`;
    }
  }
};

const TextLoop = ({
  text = "React ✦ Bits",
  shape = "wave",
  path,
  speed = 90,
  direction = "forward",
  separator = "✦",
  curviness = 90,
  fontSize = 46,
  fontWeight = 800,
  letterSpacing = 2,
  uppercase = true,
  color = "#ffffff",
  ribbon = true,
  ribbonColor = "#5227FF",
  ribbonWidth = 86,
  pauseOnHover = true,
  className = "",
  style = {},
  dir: propDir,
  isRTL: propIsRTL,
}: TextLoopProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const measureRef = useRef<SVGTextElement | null>(null);
  const headRef = useRef<SVGTextPathElement | null>(null);
  const tailRef = useRef<SVGTextPathElement | null>(null);

  const [metrics, setMetrics] = useState<Metrics>({ length: 0, reps: 1 });

  const rawId = useId();
  const pathId = `text-loop-${rawId.replace(/:/g, "")}`;

  const isLine = shape === "line";
  const effectiveViewH = isLine
    ? Math.max(ribbonWidth + 24, fontSize * 2 + 16, 70)
    : VIEW_H;
  const effectiveCY = effectiveViewH / 2;

  const d = useMemo(() => {
    if (path) return path;
    if (shape === "line") {
      return `M -320 ${effectiveCY} L ${VIEW_W + 320} ${effectiveCY}`;
    }
    return buildPath(shape, curviness, ribbonWidth);
  }, [path, shape, curviness, ribbonWidth, effectiveCY]);

  // Robust RTL detection: explicit prop > Arabic unicode in text > document dir
  const isRTL = useMemo(() => {
    if (propDir) return propDir === "rtl";
    if (typeof propIsRTL === "boolean") return propIsRTL;
    if (text && /[\u0600-\u06FF]/.test(text)) return true;
    if (
      typeof document !== "undefined" &&
      document.documentElement.dir === "rtl"
    )
      return true;
    return false;
  }, [propDir, propIsRTL, text]);

  const unit = useMemo(() => {
    const base =
      uppercase && !isRTL ? String(text).toUpperCase() : String(text);
    const gap = separator ? `\u00A0${separator}\u00A0` : "\u00A0\u00A0\u00A0";
    return `${base}${gap}`;
  }, [text, separator, uppercase, isRTL]);

  const textStyle = useMemo<CSSProperties>(
    () => ({
      fontSize: `${fontSize}px`,
      fontWeight,
      letterSpacing: isRTL ? "normal" : `${letterSpacing}px`,
      direction: "ltr", // Keep SVG coordinate text flow stable
    }),
    [fontSize, fontWeight, letterSpacing, isRTL],
  );

  useLayoutEffect(() => {
    const pathEl = pathRef.current;
    const measureEl = measureRef.current;
    if (!pathEl || !measureEl) return undefined;

    let cancelled = false;

    const measure = () => {
      if (cancelled) return;
      let length = 0;
      let unitWidth = 0;
      try {
        length = pathEl.getTotalLength();
        unitWidth = measureEl.getComputedTextLength();
      } catch {
        return;
      }
      if (!length) return;

      const reps =
        unitWidth > 0 ? Math.max(2, Math.ceil(length / unitWidth) + 1) : 2;
      setMetrics((prev) =>
        prev.length === length && prev.reps === reps ? prev : { length, reps },
      );
    };

    measure();
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    return () => {
      cancelled = true;
    };
  }, [d, unit, fontSize, fontWeight, letterSpacing]);

  useEffect(() => {
    const { length } = metrics;
    const head = headRef.current;
    const tail = tailRef.current;
    if (!head || !tail || !length) return undefined;

    const apply = (offset: number) => {
      const partner = offset >= 0 ? offset - length : offset + length;
      head.setAttribute("startOffset", String(offset));
      tail.setAttribute("startOffset", String(partner));
    };

    apply(0);

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || speed <= 0) return undefined;

    // Adjust direction for RTL vs LTR
    const activeDir = isRTL
      ? direction === "forward"
        ? "reverse"
        : "forward"
      : direction;

    const state = { offset: 0 };
    const tween = gsap.to(state, {
      offset: activeDir === "reverse" ? -length : length,
      duration: length / speed,
      ease: "none",
      repeat: -1,
      onUpdate: () => apply(state.offset),
    });

    const root = rootRef.current;
    const pause = () => tween.pause();
    const resume = () => tween.resume();

    if (pauseOnHover && root) {
      root.addEventListener("pointerenter", pause);
      root.addEventListener("pointerleave", resume);
    }

    return () => {
      tween.kill();
      if (pauseOnHover && root) {
        root.removeEventListener("pointerenter", pause);
        root.removeEventListener("pointerleave", resume);
      }
    };
  }, [metrics, speed, direction, pauseOnHover, isRTL]);

  const loopText = unit.repeat(metrics.reps);

  // For 'line' shape: seamless, infinite, smooth marquee that natively handles both Arabic & English
  if (shape === "line") {
    const duration = Math.max(35, Math.round(1800 / (speed || 50)));
    // In LTR: forward moves left (LTR), reverse moves right (RTL)
    // In RTL: forward moves right (RTL), reverse moves left (LTR)
    const isMovingRight = isRTL
      ? direction === "forward"
      : direction === "reverse";
    const animClass = isMovingRight
      ? "animate-marquee-rtl"
      : "animate-marquee-ltr";
    const repCount = 6;

    return (
      <div
        ref={rootRef}
        dir="ltr"
        className={cn(
          "marquee-container relative w-full overflow-hidden flex select-none py-1.5",
          className,
        )}
        style={
          { ...style, "--marquee-duration": `${duration}s` } as CSSProperties
        }
      >
        <div
          className={cn(
            "flex shrink-0 min-w-full items-center justify-around whitespace-nowrap will-change-transform",
            animClass,
          )}
        >
          {Array.from({ length: repCount }).map((_, i) => (
            <span
              key={`track1-${i}`}
              dir={isRTL ? "rtl" : "ltr"}
              style={{
                fontSize: `${fontSize}px`,
                fontWeight,
                letterSpacing: isRTL ? "normal" : `${letterSpacing}px`,
                color: color === "currentColor" ? undefined : color,
              }}
              className="inline-flex items-center px-4"
            >
              <span>{text}</span>
              {separator && (
                <span className="mx-4 opacity-50 text-[0.85em] text-white select-none">
                  {separator}
                </span>
              )}
            </span>
          ))}
        </div>

        <div
          className={cn(
            "flex shrink-0 min-w-full items-center justify-around whitespace-nowrap will-change-transform",
            animClass,
          )}
          aria-hidden="true"
        >
          {Array.from({ length: repCount }).map((_, i) => (
            <span
              key={`track2-${i}`}
              dir={isRTL ? "rtl" : "ltr"}
              style={{
                fontSize: `${fontSize}px`,
                fontWeight,
                letterSpacing: isRTL ? "normal" : `${letterSpacing}px`,
                color: color === "currentColor" ? undefined : color,
              }}
              className="inline-flex items-center px-4"
            >
              <span>{text}</span>
              {separator && (
                <span className="mx-4 opacity-50 text-[0.85em] select-none">
                  {separator}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      dir="ltr"
      className={`relative w-full overflow-hidden ${className}`.trim()}
      style={style}
    >
      <svg
        className="block w-full h-auto"
        viewBox={`0 0 ${VIEW_W} ${effectiveViewH}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={text}
      >
        <path
          ref={pathRef}
          id={pathId}
          d={d}
          fill="none"
          stroke={ribbon ? ribbonColor : "none"}
          strokeWidth={ribbon ? ribbonWidth : 0}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <text
          ref={measureRef}
          className="invisible pointer-events-none"
          style={textStyle}
          aria-hidden="true"
        >
          {unit}
        </text>

        <text
          className="select-none"
          style={textStyle}
          fill={color}
          dominantBaseline="central"
          aria-hidden="true"
        >
          <textPath ref={headRef} href={`#${pathId}`} startOffset={0}>
            {loopText}
          </textPath>
        </text>

        <text
          className="select-none"
          style={textStyle}
          fill={color}
          dominantBaseline="central"
          aria-hidden="true"
        >
          <textPath ref={tailRef} href={`#${pathId}`} startOffset={0}>
            {loopText}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default TextLoop;
