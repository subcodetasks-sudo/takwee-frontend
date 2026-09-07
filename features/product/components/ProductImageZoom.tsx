"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const ZOOM_SIZE = "240%";

interface ProductImageZoomProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export function ProductImageZoom({
  src,
  alt,
  priority = false,
  className,
}: ProductImageZoomProps) {
  const t = useTranslations("ProductDetails");
  const [isZooming, setIsZooming] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomLayerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  useEffect(() => {
    setIsZooming(false);
    if (zoomLayerRef.current) {
      zoomLayerRef.current.style.backgroundPosition = "50% 50%";
    }
  }, [src]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || !zoomLayerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const percentX = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const percentY = Math.max(0, Math.min(100, (y / rect.height) * 100));

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      rafIdRef.current = requestAnimationFrame(() => {
        if (zoomLayerRef.current) {
          zoomLayerRef.current.style.backgroundPosition = `${percentX}% ${percentY}%`;
        }
      });
    },
    [],
  );

  const handleMouseEnter = () => setIsZooming(true);

  const handleMouseLeave = () => {
    setIsZooming(false);
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative aspect-3/4 min-w-0 overflow-hidden rounded-xl bg-muted",
        "cursor-crosshair select-none",
        className,
      )}
    >
      <Image
        key={src}
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 45vw"
        className={cn(
          "object-cover object-center pointer-events-none transition-opacity duration-150",
          isZooming ? "opacity-0" : "opacity-100",
        )}
      />

      <div
        ref={zoomLayerRef}
        aria-hidden
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-150 will-change-[background-position]",
          "hidden lg:block",
          isZooming ? "opacity-100" : "opacity-0",
        )}
        style={{
          backgroundImage: `url(${src})`,
          backgroundPosition: "50% 50%",
          backgroundSize: ZOOM_SIZE,
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="pointer-events-none absolute inset-e-3 bottom-3 z-10 hidden items-center gap-1.5 rounded-full bg-foreground/70 px-2.5 py-1 text-[11px] text-background opacity-80 backdrop-blur-xs lg:flex">
        <ZoomIn className="size-3.5" aria-hidden />
        <span>{t("hoverToZoom")}</span>
      </div>
    </div>
  );
}
