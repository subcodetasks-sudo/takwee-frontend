import React from "react";
import { getTranslations } from "next-intl/server";
import { BookOpen, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchBlogs } from "../api/get-blogs";
import { BlogCard } from "./BlogCard";
import { BlogHero } from "./BlogHero";

interface BlogListProps {
  locale?: string;
  page?: number;
  search?: string;
  category?: string;
}

export async function BlogList({ locale = "ar", page = 1, search, category }: BlogListProps) {
  const t = await getTranslations({ locale, namespace: "Blogs" });
  
  const { posts, pagination } = await fetchBlogs({
    page,
    perPage: 12,
    search,
    category,
    locale,
  });

  // Extract unique categories (ideally this comes from an API, but we'll extract from current posts if needed)
  // For a real server component, we would fetch all categories. Here we just use a hardcoded list or fetch once.
  // Actually, we can fetch categories if we have an endpoint, but since we don't, we will just not display categories if they are empty, or we fetch a large list of blogs and extract them.
  // We'll fetch a list of all blogs to get categories (just for the hero, or limit to known ones)
  let availableCategories: string[] = [];
  try {
     const allBlogs = await fetchBlogs({ perPage: 100, locale });
     const set = new Set<string>();
     allBlogs.posts.forEach((p) => {
       if (p.category) set.add(p.category);
     });
     availableCategories = Array.from(set);
  } catch (e) {
     // Ignore
  }

  const featuredPost = posts.find((p) => p.isFeatured) || (posts.length > 0 && !search && !category ? posts[0] : null);
  const gridPosts = featuredPost ? posts.filter((p) => p.id !== featuredPost.id) : posts;

  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    params.set("page", newPage.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Hero with Search and Category filters */}
      <BlogHero categories={availableCategories} />

      {/* Main Content Area */}
      {posts.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/50 p-12 text-center my-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            {search || category ? (
              <Inbox className="h-8 w-8 stroke-[1.5]" />
            ) : (
              <BookOpen className="h-8 w-8 stroke-[1.5]" />
            )}
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {search || category
              ? t("noSearchResultsTitle")
              : t("noBlogsTitle")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {search || category
              ? t("noSearchResultsSubtitle")
              : t("noBlogsSubtitle")}
          </p>
          {(search || category) && (
            <Link
              href="/blogs"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-5 rounded-full",
              )}
            >
              {t("resetFilters")}
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Featured Post if applicable */}
          {featuredPost && (
            <div>
              <BlogCard post={featuredPost} featured />
            </div>
          )}

          {/* Grid of Remaining Posts */}
          {gridPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post) => (
                <div key={post.id}>
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.lastPage > 1 && (
            <nav
              aria-label={t("paginationLabel")}
              className="flex items-center justify-center gap-2 pt-6 border-t border-border/40"
            >
              {pagination.hasPrevPage ? (
                <Link
                  href={buildPageUrl(pagination.currentPage - 1)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "gap-1 rounded-full text-xs",
                  )}
                >
                  <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                  <span>{t("previousPage")}</span>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="gap-1 rounded-full text-xs"
                >
                  <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                  <span>{t("previousPage")}</span>
                </Button>
              )}

              <div className="flex items-center gap-1 px-2 text-xs font-medium text-muted-foreground">
                <span>
                  {pagination.currentPage} / {pagination.lastPage}
                </span>
              </div>

              {pagination.hasNextPage ? (
                <Link
                  href={buildPageUrl(pagination.currentPage + 1)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "gap-1 rounded-full text-xs",
                  )}
                >
                  <span>{t("nextPage")}</span>
                  <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="gap-1 rounded-full text-xs"
                >
                  <span>{t("nextPage")}</span>
                  <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                </Button>
              )}
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
