import type { ImageLoaderProps } from "next/image";
import { resolveImageUrl } from "./resolve-image-url";

/**
 * Optional `next/image` loader for API-hosted media.
 *
 * Pass as `loader={imageLoader}` when `src` is an API path, storage key, or
 * absolute API URL. Local `/imgs` assets should omit this loader and use the
 * default Next optimizer.
 *
 * Do not set this as a global `images.loaderFile`.
 */
export default function imageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  return resolveImageUrl(src, {
    mode: "proxy",
    width,
    quality: quality ?? 75,
  });
}
