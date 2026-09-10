import { resolveImageUrl } from "@/lib/images";
import type {
  AdditionalSection,
  AdvertisementTape,
  ApiHomePageData,
  CategoryItem,
  HeroSlide,
  HomePageData,
} from "../types";
import { categoryHref } from "@/features/categories";
import { mapHomeProduct } from "./map-home-product";
import { slugify } from "./slugify";

function mapAdvertisementTapes(
  tapes: ApiHomePageData["advertisement_tapes"],
): AdvertisementTape[] {
  return (tapes ?? [])
    .filter((tape) => tape.text?.trim())
    .map((tape) => ({
      id: String(tape.id),
      text: tape.text.trim(),
    }));
}

function mapHeroes(heroes: ApiHomePageData["heroes"]): HeroSlide[] {
  return [...(heroes ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((hero) => ({
      id: String(hero.id),
      image: resolveImageUrl(hero.image) || hero.image,
      title: hero.title,
      description: hero.description,
      href: "/shop",
    }));
}

function mapCategories(
  categories: ApiHomePageData["categories"],
): CategoryItem[] {
  return [...(categories ?? [])]
    .filter((category) => category.status === "active")
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((category) => ({
      id: String(category.id),
      name: category.name,
      image: category.image ? resolveImageUrl(category.image) || category.image : null,
      href: categoryHref(category.name, category.id),
    }));
}

function buildSections(data: ApiHomePageData): AdditionalSection[] {
  const productsByCategory = new Map<
    string,
    ReturnType<typeof mapHomeProduct>[]
  >();

  for (const product of data.products ?? []) {
    const key = String(product.category.id);
    const mapped = mapHomeProduct(product);
    const list = productsByCategory.get(key) ?? [];
    list.push(mapped);
    productsByCategory.set(key, list);
  }

  const tones: Array<"primary" | "secondary"> = ["primary", "secondary"];

  return [...(data.categories ?? [])]
    .filter((category) => category.status === "active")
    .sort((a, b) => a.sort_order - b.sort_order)
    .flatMap((category, index) => {
      const sectionProducts = (
        productsByCategory.get(String(category.id)) ?? []
      ).slice(0, 4);

      if (sectionProducts.length === 0) return [];

      const slug = slugify(category.name) || `category-${category.id}`;

      const section: AdditionalSection = {
        id: String(category.id),
        slug,
        title: category.name,
        bannerImage: category.image
          ? resolveImageUrl(category.image) || category.image
          : undefined,
        bannerTone: tones[index % tones.length],
        href: categoryHref(category.name, category.id),
        products: sectionProducts,
        sortOrder: category.sort_order,
        isActive: true,
      };

      return [section];
    });
}

/** Normalize the home API payload into storefront view models. */
export function mapHomePageData(data: ApiHomePageData): HomePageData {
  return {
    heroes: mapHeroes(data.heroes),
    advertisementTapes: mapAdvertisementTapes(data.advertisement_tapes),
    categories: mapCategories(data.categories),
    sections: buildSections(data),
    products: (data.products ?? []).map(mapHomeProduct),
  };
}

/** Join advertisement tape texts for the header TextLoop ribbon. */
export function joinAdvertisementTapeText(
  tapes: AdvertisementTape[],
  separator = "❖",
): string {
  return tapes
    .map((tape) => tape.text.trim())
    .filter(Boolean)
    .join(` ${separator} `);
}
