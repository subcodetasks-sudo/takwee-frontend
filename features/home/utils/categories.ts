import type { CategoryItem } from "../types";

/** Local fallback categories when the home API has not returned categories yet. */
export const HOME_CATEGORIES: CategoryItem[] = [
  {
    id: "linen",
    name: "Linen",
    image: "/imgs/hero-slide-1.jpg",
    href: "/shop/linen",
  },
  {
    id: "casual",
    name: "Casual",
    image: "/imgs/hero-slide-2.jpg",
    href: "/shop/casual",
  },
  {
    id: "formal",
    name: "Formal",
    image: "/imgs/hero-slide-3.jpg",
    href: "/shop/formal",
  },
  {
    id: "travel",
    name: "Travel",
    image: "/imgs/hero-slide-2.jpg",
    href: "/shop/travel",
  },
  {
    id: "inners",
    name: "Inners",
    image: "/imgs/hero-slide-1.jpg",
    href: "/shop/inners",
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "/imgs/hero-slide-3.jpg",
    href: "/shop/accessories",
  },
];
