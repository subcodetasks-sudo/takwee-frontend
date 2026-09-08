"use client";

import Grainient from "@/components/Grainient";
import { AuthGrainientMotion } from "./AuthShellMotion";

/**
 * Brand hexes from `app/globals.css` `:root` primary / secondary scales.
 * Grainient requires literal hex (not CSS variables).
 */
const BRAND_COLOR_1 = "#d5cac3"; // primary-300
const BRAND_COLOR_2 = "#b4a094"; // primary-500
const BRAND_COLOR_3 = "#5e6b4f"; // secondary-500

export function AuthGrainientBackground() {
  return (
    <AuthGrainientMotion
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <Grainient
        color1={BRAND_COLOR_1}
        color2={BRAND_COLOR_2}
        color3={BRAND_COLOR_3}
        lightMode
        timeSpeed={0.18}
        colorBalance={0.05}
        warpStrength={0.85}
        warpFrequency={4.2}
        warpSpeed={1.4}
        warpAmplitude={55}
        blendAngle={18}
        blendSoftness={0.12}
        rotationAmount={380}
        noiseScale={1.6}
        grainAmount={0.08}
        grainScale={2.4}
        contrast={1.25}
        gamma={1.05}
        saturation={0.92}
        zoom={1.05}
        className="h-full w-full"
      />
      <div className="absolute inset-0 bg-background/70" aria-hidden />
    </AuthGrainientMotion>
  );
}
