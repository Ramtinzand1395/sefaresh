import Image, { type ImageLoader } from "next/image";
import { IconPackage } from "@tabler/icons-react";
import { cn } from "@/lib/cn";

const passthroughImageLoader: ImageLoader = ({ src }) => src;

export function ProductImage({
  src,
  alt,
  size = "card",
}: {
  src?: string;
  alt: string;
  size?: "card" | "detail";
}) {
  const isRemote = Boolean(src && /^https?:\/\//.test(src));
  const className = size === "card"
    ? "size-20 rounded-2xl sm:size-24"
    : "size-24 rounded-2xl sm:size-28";

  if (src && (src.startsWith("/") || isRemote)) {
    return (
      <span className={cn("relative shrink-0 overflow-hidden border border-line/70 bg-surface-subtle", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={size === "card" ? "(max-width: 640px) 80px, 96px" : "(max-width: 640px) 96px, 112px"}
          className="object-contain p-1.5"
          loader={isRemote ? passthroughImageLoader : undefined}
          unoptimized={isRemote}
        />
      </span>
    );
  }

  return (
    <span className={cn("grid shrink-0 place-items-center bg-primary-soft text-primary", className)}>
      <IconPackage size={size === "card" ? 30 : 36} aria-hidden="true" />
    </span>
  );
}
