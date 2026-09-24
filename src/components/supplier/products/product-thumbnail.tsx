import Image, { type ImageLoader } from "next/image";
import { IconPackage } from "@tabler/icons-react";
import { cn } from "@/lib/cn";

export function ProductThumbnail({
  src,
  alt,
  size = "md",
}: {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "size-11 rounded-xl",
    md: "size-16 rounded-xl",
    lg: "size-20 rounded-2xl",
  } as const;
  const pixels = size === "sm" ? "44px" : size === "md" ? "64px" : "80px";

  const isRemoteImage = Boolean(src && /^https?:\/\//.test(src));

  if (src && (src.startsWith("/") || isRemoteImage)) {
    return (
      <span className={cn("relative shrink-0 overflow-hidden border border-line bg-white", sizes[size])}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={pixels}
          className="object-cover"
          loader={isRemoteImage ? passthroughImageLoader : undefined}
          unoptimized={isRemoteImage}
        />
      </span>
    );
  }

  return (
    <span className={cn("grid shrink-0 place-items-center bg-primary-soft text-primary", sizes[size])}>
      <IconPackage size={size === "sm" ? 20 : size === "md" ? 28 : 34} aria-hidden="true" />
    </span>
  );
}

const passthroughImageLoader: ImageLoader = ({ src }) => src;
