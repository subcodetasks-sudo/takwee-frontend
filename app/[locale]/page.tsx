import {
  HeroCarousel,
  CategoriesSection,
  AdditionalSections,
} from "@/features/home";

export default function HomePage() {
  return (
    <main className="w-full flex flex-col flex-1">
      <HeroCarousel />
      <CategoriesSection />
      <AdditionalSections />
    </main>
  );
}

