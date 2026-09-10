import { NextResponse, type NextRequest } from "next/server";
import { isAllowedImageUrl } from "@/lib/images/allowed-hosts";
import { resolveUpstreamImageUrl } from "@/lib/images/resolve-image-url";

export const runtime = "nodejs";

const DEFAULT_CACHE_CONTROL =
  "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

/**
 * Same-origin image proxy for media hosted on the API origin
 * (`API_BASE_URL` / `NEXT_PUBLIC_API_BASE_URL`).
 *
 * GET /api/images?src=<api-path-or-absolute-url>&w=&q=
 *
 * `w` / `q` are accepted for loader compatibility; upstream resizing can be
 * wired later when the API supports transforms.
 */
export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src")?.trim();
  if (!src) return badRequest("Missing required query parameter: src");

  const upstream = resolveUpstreamImageUrl(src);
  if (!upstream || !isAllowedImageUrl(upstream)) {
    return NextResponse.json(
      { error: "Image source is not allowed or not configured" },
      { status: 403 },
    );
  }

  try {
    const upstreamResponse = await fetch(upstream, {
      headers: {
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "User-Agent": "LinenLineStoreImageProxy/1.0",
      },
      redirect: "follow",
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch upstream image" },
        { status: upstreamResponse.status === 404 ? 404 : 502 },
      );
    }

    const contentType = upstreamResponse.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Upstream response is not an image" },
        { status: 502 },
      );
    }

    const finalUrl = upstreamResponse.url;
    if (finalUrl && !isAllowedImageUrl(finalUrl)) {
      return NextResponse.json(
        { error: "Redirect target is not an allowed image host" },
        { status: 403 },
      );
    }

    const body = upstreamResponse.body;
    if (!body) {
      return NextResponse.json(
        { error: "Empty upstream image body" },
        { status: 502 },
      );
    }

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", DEFAULT_CACHE_CONTROL);

    const contentLength = upstreamResponse.headers.get("content-length");
    if (contentLength) headers.set("Content-Length", contentLength);

    return new NextResponse(body, {
      status: 200,
      headers,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to proxy image" },
      { status: 502 },
    );
  }
}
