"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface NewsletterAnimationProps {
  className?: string;
}

export function NewsletterAnimation({ className }: NewsletterAnimationProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden select-none",
        className
      )}
      aria-hidden="true"
    >
      {/* 1. Large Background Rotating Loom & Sacred Linen Circle */}
      <svg
        viewBox="0 0 800 400"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
      >
        <defs>
          {/* Subtle linen thread gradients using semantic CSS variables */}
          <linearGradient id="threadGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary-400)" stopOpacity="0.35" />
            <stop offset="50%" stopColor="var(--primary-600)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--secondary-500)" stopOpacity="0.25" />
          </linearGradient>

          <linearGradient id="threadGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--secondary-400)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--primary-500)" stopOpacity="0.1" />
          </linearGradient>

          <radialGradient id="loomCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary-300)" stopOpacity="0.25" />
            <stop offset="60%" stopColor="var(--primary-500)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--primary-500)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Radial Core behind the rotating circles */}
        <circle
          cx="620"
          cy="200"
          r="220"
          fill="url(#loomCenterGlow)"
          className="animate-pulse-glow"
        />

        {/* 2. Flowing Weaving Thread Waves across the width */}
        <path
          d="M-50,220 C200,120 350,310 620,190 C720,150 820,260 900,210"
          stroke="url(#threadGradient1)"
          strokeWidth="1.75"
          strokeDasharray="10 14"
          className="animate-dash-flow opacity-70"
        />
        <path
          d="M-40,160 C180,260 420,130 630,230 C760,280 830,170 880,180"
          stroke="url(#threadGradient2)"
          strokeWidth="1.25"
          strokeDasharray="6 10"
          className="animate-dash-flow opacity-60 [animation-direction:reverse]"
        />

        {/* 3. The Grand "Linen Circle" Celestial Loom (Group with slow rotation) */}
        <g transform="translate(620, 200)">
          {/* Outer Loom Track - Clockwise */}
          <g className="animate-slow-spin">
            {/* Outer dotted orbit */}
            <circle
              cx="0"
              cy="0"
              r="170"
              stroke="var(--primary-400)"
              strokeWidth="1"
              strokeDasharray="4 8"
              opacity="0.35"
            />
            {/* 12 Artisanal Loom Spoke notches */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="155"
                y1="0"
                x2="175"
                y2="0"
                stroke="var(--primary-500)"
                strokeWidth="1"
                opacity="0.4"
                transform={`rotate(${deg})`}
              />
            ))}
          </g>

          {/* Middle Loom Track - Counter-Clockwise */}
          <g className="animate-reverse-spin">
            <circle
              cx="0"
              cy="0"
              r="125"
              stroke="var(--secondary-500)"
              strokeWidth="1.2"
              strokeDasharray="12 12"
              opacity="0.45"
            />
            {/* 8 Geometric Weave Diamonds */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <rect
                key={deg}
                x="121"
                y="-4"
                width="8"
                height="8"
                fill="none"
                stroke="var(--secondary-400)"
                strokeWidth="1"
                opacity="0.4"
                transform={`rotate(${deg})`}
              />
            ))}
          </g>

          {/* Inner Medallion Orbit - Clockwise */}
          <g className="animate-slow-spin">
            <circle
              cx="0"
              cy="0"
              r="80"
              stroke="var(--primary-600)"
              strokeWidth="1"
              strokeDasharray="6 6"
              opacity="0.4"
            />
            <circle
              cx="0"
              cy="0"
              r="45"
              stroke="var(--primary-500)"
              strokeWidth="1"
              opacity="0.3"
            />
            {/* 4-Point Celestial Linen Star */}
            <path
              d="M0,-24 Q0,0 24,0 Q0,0 0,24 Q0,0 -24,0 Q0,0 0,-24 Z"
              fill="var(--primary-500)"
              opacity="0.15"
              stroke="var(--primary-500)"
              strokeWidth="1"
            />
          </g>
        </g>
      </svg>

      {/* 4. Drifting Organic Linen / Flax Blossom Silhouettes */}
      {/* Floating Petal 1 - Top Left */}
      <div className="absolute top-6 start-8 sm:start-16 animate-float-gentle opacity-40 dark:opacity-30">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <path
            d="M17 2 C24 10 26 22 17 32 C8 22 10 10 17 2 Z"
            stroke="var(--secondary-500)"
            strokeWidth="1.2"
            fill="var(--secondary-500)"
            fillOpacity="0.08"
          />
          <line
            x1="17"
            y1="6"
            x2="17"
            y2="28"
            stroke="var(--secondary-400)"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
        </svg>
      </div>

      {/* Floating Petal 2 - Bottom Left / Center */}
      <div className="absolute bottom-6 start-1/3 animate-float-subtle opacity-35 dark:opacity-25">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M14 2 C20 8 22 18 14 26 C6 18 8 8 14 2 Z"
            stroke="var(--primary-600)"
            strokeWidth="1"
            fill="var(--primary-500)"
            fillOpacity="0.1"
            transform="rotate(45 14 14)"
          />
        </svg>
      </div>

      {/* Floating Petal 3 - Mid Right */}
      <div className="absolute top-1/3 end-12 sm:end-20 animate-float-gentle [animation-delay:2s] opacity-35 dark:opacity-25">
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
          <path
            d="M19 3 C27 12 29 25 19 35 C9 25 11 12 19 3 Z"
            stroke="var(--primary-500)"
            strokeWidth="1.2"
            fill="var(--primary-400)"
            fillOpacity="0.08"
            transform="rotate(-30 19 19)"
          />
          <circle cx="19" cy="19" r="2.5" fill="var(--primary-600)" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
}
