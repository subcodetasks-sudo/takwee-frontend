import type { HeroSlide } from "../types";

/** Local fallback slides when the home API has not returned heroes yet. */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    image: "/imgs/hero-slide-1.jpg",
    title: "Bespoke Elegance in Natural Linen",
    description:
      "Crafted with lightweight breathable linen textures and architectural silhouettes tailored for contemporary modest luxury.",
    tag: "Pure Organic Linen",
    href: "/shop",
  },
  {
    id: "slide-2",
    image: "/imgs/hero-slide-2.jpg",
    title: "The Olive Heritage Series",
    description:
      "Subtle hand-finished embroidery inspired by earthy Mediterranean palettes and refined minimalist cuts.",
    tag: "Artisanal Embroidery",
    href: "/shop",
  },
  {
    id: "slide-3",
    image: "/imgs/hero-slide-3.jpg",
    title: "Silk & Linen Midnight Radiance",
    description:
      "Flowing evening elegance adorned with subtle gold accents, designed for prestigious formal occasions.",
    tag: "Evening Modesty",
    href: "/shop",
  },
];
