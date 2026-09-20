import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className = "w-[152px]", priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/brand/logo-sefaresh.png"
      alt="سفارش"
      width={749}
      height={213}
      priority={priority}
      className={`h-auto ${className}`}
    />
  );
}
