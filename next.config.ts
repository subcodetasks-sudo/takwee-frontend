import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

function imagesRemotePatternsFromEnv() {
  const patterns: NonNullable<
    NonNullable<NextConfig["images"]>["remotePatterns"]
  > = [
    {
      protocol: "https",
      hostname: "flagcdn.com",
      pathname: "/**",
    },
  ];

  const seen = new Set<string>(["flagcdn.com"]);

  for (const raw of [
    process.env.NEXT_PUBLIC_API_BASE_URL,
    process.env.API_BASE_URL,
  ]) {
    if (!raw?.trim()) continue;
    try {
      const url = new URL(raw.trim());
      if (url.protocol !== "http:" && url.protocol !== "https:") continue;

      const hostname = url.hostname.toLowerCase();
      if (seen.has(hostname)) continue;
      seen.add(hostname);

      patterns.push({
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname,
        pathname: "/**",
      });
    } catch {
      // ignore invalid env values at build time
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    // Next.js 16+ requires localPatterns when `src` includes a query string
    // (e.g. `/api/images?src=…`). Omitting `search` allows any query params.
    localPatterns: [
      {
        pathname: "/api/images",
      },
      {
        pathname: "/imgs/**",
        search: "",
      },
    ],
    remotePatterns: imagesRemotePatternsFromEnv(),
  },
};

export default withNextIntl(nextConfig);
