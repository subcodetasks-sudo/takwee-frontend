import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogList } from "@/features/blogs";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blogs" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      type: "website",
    },
  };
}

export default async function BlogsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const searchParamsObj = await searchParams;
  const page = typeof searchParamsObj.page === 'string' ? parseInt(searchParamsObj.page, 10) : 1;
  const search = typeof searchParamsObj.search === 'string' ? searchParamsObj.search : undefined;
  const category = typeof searchParamsObj.category === 'string' ? searchParamsObj.category : undefined;

  return (
    <main className="min-h-screen py-8 md:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <BlogList locale={locale} page={page} search={search} category={category} />
      </div>
    </main>
  );
}
