"use client";

import { useEffect, useState } from "react";
import Grainient from "@/components/Grainient";
import { AuthGrainientMotion } from "./AuthShellMotion";

/**
 * Brand hexes from `app/globals.css` primary / secondary scales.
 * Grainient requires literal hex (not CSS variables).
 */
/**
 * Brand hexes from `app/globals.css` primary / secondary scales.
 * Grainient requires literal hex (not CSS variables).
 */
// Light mode: Warm linen and sage tones (#b4a094, #c5b5ac, #5e6b4f)
const LIGHT_BRAND_COLOR_1 = "#c5b5ac"; // primary-400 (warm linen sand)
const LIGHT_BRAND_COLOR_2 = "#b4a094"; // primary-500 (brand signature linen taupe)
const LIGHT_BRAND_COLOR_3 = "#5e6b4f"; // secondary-500 (olive/sage accent)

// Dark mode: Elegant warm brand midnight & dark olive/amber tones (#443e3a, #525d46, #615751)
const DARK_BRAND_COLOR_1 = "#443e3a"; // primary-900 (warm charcoal brown)
const DARK_BRAND_COLOR_2 = "#525d46"; // secondary-600 (rich deep olive sage)
const DARK_BRAND_COLOR_3 = "#615751"; // primary-800 (warm earth taupe)

export function AuthGrainientBackground() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      const hasDarkClass = root.classList.contains("dark");
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(hasDarkClass || (!root.classList.contains("light") && systemDark));
    };

    updateTheme();

    const observer = new MutationObserver(() => updateTheme());
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => updateTheme();
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  return (
    <AuthGrainientMotion
      className="pointer-events-none absolute inset-0 overflow-hidden bg-background"
    >
      <Grainient
        color1={isDark ? DARK_BRAND_COLOR_1 : LIGHT_BRAND_COLOR_1}
        color2={isDark ? DARK_BRAND_COLOR_2 : LIGHT_BRAND_COLOR_2}
        color3={isDark ? DARK_BRAND_COLOR_3 : LIGHT_BRAND_COLOR_3}
        lightMode={false}
        timeSpeed={isDark ? 0.16 : 0.2}
        colorBalance={isDark ? 0.0 : 0.08}
        warpStrength={0.9}
        warpFrequency={3.8}
        warpSpeed={1.3}
        warpAmplitude={50}
        blendAngle={24}
        blendSoftness={0.16}
        rotationAmount={340}
        noiseScale={1.5}
        grainAmount={isDark ? 0.05 : 0.06}
        grainScale={2.2}
        contrast={isDark ? 1.25 : 1.15}
        gamma={isDark ? 1.05 : 1.0}
        saturation={isDark ? 1.2 : 1.1}
        zoom={1.05}
        className="h-full w-full transition-opacity duration-700 opacity-70 dark:opacity-60"
      />
      <div
        className="absolute inset-0 bg-background/55 transition-colors duration-700 dark:bg-background/70"
        aria-hidden
      />
    </AuthGrainientMotion>
  );
}
