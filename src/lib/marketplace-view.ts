import "server-only";

import type {
  MarketplaceCategoryView,
  MarketplaceProductDetailView,
  MarketplaceProductView,
} from "@/components/products/marketplace-types";
import type {
  MarketplaceCategoryItem,
  MarketplaceProductDetail,
  MarketplaceProductItem,
} from "@/repositories/marketplace-repository";

export function toMarketplaceProductView(product: MarketplaceProductItem): MarketplaceProductView {
  return {
    productId: product.productId.toHexString(),
    title: product.title,
    slug: product.slug,
    brand: product.brand,
    image: product.image,
    unit: product.unit,
    unitValue: product.unitValue,
    categoryId: product.categoryId.toHexString(),
    categoryName: product.categoryName,
    availableSupplierCount: product.availableSupplierCount,
    lowestPrice: product.lowestPrice,
    highestPrice: product.highestPrice,
    totalAvailableStock: product.totalAvailableStock,
  };
}

export function toMarketplaceDetailView(
  product: MarketplaceProductDetail,
): MarketplaceProductDetailView {
  return {
    ...toMarketplaceProductView(product),
    offers: product.offers.map((offer) => ({
      offerId: offer.offerId.toHexString(),
      supplierId: offer.supplierId.toHexString(),
      supplierName: offer.supplierName,
      price: offer.price,
      stock: offer.stock,
      minOrderQuantity: offer.minOrderQuantity,
      maxOrderQuantity: offer.maxOrderQuantity,
      deliveryDays: offer.deliveryDays,
    })),
  };
}

export function toMarketplaceCategoryView(
  category: MarketplaceCategoryItem,
): MarketplaceCategoryView {
  return { categoryId: category._id.toHexString(), name: category.name };
}
