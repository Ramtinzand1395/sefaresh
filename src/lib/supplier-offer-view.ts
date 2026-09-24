import "server-only";

import type {
  CatalogProductView,
  SupplierOfferView,
} from "@/components/supplier/products/supplier-offer-types";
import type {
  CatalogProductItem,
  SupplierOfferListItem,
} from "@/repositories/supplier-offer-repository";

export function toCatalogProductView(product: CatalogProductItem): CatalogProductView {
  return {
    productId: product._id.toHexString(),
    title: product.title,
    slug: product.slug,
    brand: product.brand,
    image: product.image,
    unit: product.unit,
    unitValue: product.unitValue,
  };
}

export function toSupplierOfferView(offer: SupplierOfferListItem): SupplierOfferView {
  return {
    offerId: offer.offerId.toHexString(),
    productId: offer.productId.toHexString(),
    product: {
      title: offer.product.title,
      slug: offer.product.slug,
      brand: offer.product.brand,
      image: offer.product.image,
      unit: offer.product.unit,
      unitValue: offer.product.unitValue,
    },
    price: offer.price,
    stock: offer.stock,
    minOrderQuantity: offer.minOrderQuantity,
    maxOrderQuantity: offer.maxOrderQuantity,
    deliveryDays: offer.deliveryDays,
    isActive: offer.isActive,
    updatedAt: offer.updatedAt.toISOString(),
  };
}
