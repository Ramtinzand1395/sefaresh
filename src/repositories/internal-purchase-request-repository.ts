import "server-only";

import type { ObjectId, UpdateFilter } from "mongodb";
import type {
  InternalPurchaseRequest,
  InternalPurchaseRequestItem,
  InternalPurchaseRequestPriority,
  InternalPurchaseRequestStatus,
} from "@/domain/types";
import { getDomainCollection } from "@/repositories/domain-collections";

export async function findActiveProductIds(
  productIds: ObjectId[],
): Promise<Set<string>> {
  if (productIds.length === 0) {
    return new Set();
  }

  const collection = await getDomainCollection("products");
  const products = await collection
    .find(
      { _id: { $in: productIds }, status: "active" },
      { projection: { _id: 1 } },
    )
    .toArray();

  return new Set(products.map((product) => product._id.toHexString()));
}

export async function insertInternalPurchaseRequest(
  request: InternalPurchaseRequest,
): Promise<InternalPurchaseRequest> {
  const collection = await getDomainCollection("internalPurchaseRequests");
  await collection.insertOne(request);
  return request;
}

export async function findInternalPurchaseRequestById(
  requestId: ObjectId,
): Promise<InternalPurchaseRequest | null> {
  const collection = await getDomainCollection("internalPurchaseRequests");
  return collection.findOne({ _id: requestId });
}

export type InternalPurchaseRequestListItem = {
  _id: ObjectId;
  status: InternalPurchaseRequestStatus;
  priority: InternalPurchaseRequestPriority;
  reason?: string;
  createdAt: Date;
  itemCount: number;
  requesterName?: string;
};

export type InternalPurchaseRequestDetailItem = {
  id: ObjectId;
  productId?: ObjectId;
  productTitle?: string;
  productBrand?: string;
  productUnit?: string;
  customTitle?: string;
  quantity: number;
  note?: string;
  approvalStatus: "pending" | "approved" | "rejected";
  approvedQuantity: number;
};

export type InternalPurchaseRequestDetail = {
  _id: ObjectId;
  cafeId: ObjectId;
  requestedBy: ObjectId;
  requesterName?: string;
  items: InternalPurchaseRequestDetailItem[];
  reason?: string;
  priority: InternalPurchaseRequestPriority;
  status: InternalPurchaseRequestStatus;
  reviewedBy?: ObjectId;
  reviewerName?: string;
  reviewedAt?: Date;
  reviewNote?: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function listInternalPurchaseRequestsForCafe(
  cafeId: ObjectId,
  limit = 50,
): Promise<InternalPurchaseRequestListItem[]> {
  const collection = await getDomainCollection("internalPurchaseRequests");
  return collection
    .aggregate<InternalPurchaseRequestListItem>([
      { $match: { cafeId } },
      { $sort: { createdAt: -1 } },
      { $limit: Math.min(Math.max(limit, 1), 100) },
      {
        $lookup: {
          from: "users",
          localField: "requestedBy",
          foreignField: "_id",
          as: "requester",
        },
      },
      { $unwind: { path: "$requester", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          status: 1,
          priority: 1,
          reason: 1,
          createdAt: 1,
          itemCount: { $size: "$items" },
          requesterName: "$requester.name",
        },
      },
    ])
    .toArray();
}

export async function getInternalPurchaseRequestForCafe(
  requestId: ObjectId,
  cafeId: ObjectId,
): Promise<InternalPurchaseRequestDetail | null> {
  const collection = await getDomainCollection("internalPurchaseRequests");
  const request = await collection.findOne({ _id: requestId, cafeId });

  if (!request) {
    return null;
  }

  const userIds: ObjectId[] = [request.requestedBy];
  if (request.reviewedBy) {
    userIds.push(request.reviewedBy);
  }

  const productIds = request.items
    .map((item) => item.productId)
    .filter((id): id is ObjectId => id !== undefined);

  const [usersCollection, productsCollection] = await Promise.all([
    getDomainCollection("users"),
    getDomainCollection("products"),
  ]);

  const [users, products] = await Promise.all([
    usersCollection
      .find({ _id: { $in: userIds } }, { projection: { _id: 1, name: 1 } })
      .toArray(),
    productIds.length > 0
      ? productsCollection
          .find(
            { _id: { $in: productIds } },
            { projection: { _id: 1, title: 1, brand: 1, unit: 1 } },
          )
          .toArray()
      : Promise.resolve([]),
  ]);

  const userMap = new Map<string, string>(
    users.map((u) => [u._id.toHexString(), u.name]),
  );
  const productMap = new Map(
    products.map((p) => [
      p._id.toHexString(),
      { title: p.title, brand: p.brand, unit: p.unit },
    ]),
  );

  const items: InternalPurchaseRequestDetailItem[] = request.items.map((item) => {
    const productInfo = item.productId
      ? productMap.get(item.productId.toHexString())
      : undefined;

    return {
      id: item.id,
      productId: item.productId,
      productTitle: productInfo?.title,
      productBrand: productInfo?.brand,
      productUnit: productInfo?.unit,
      customTitle: item.customTitle,
      quantity: item.quantity,
      note: item.note,
      approvalStatus: item.approvalStatus,
      approvedQuantity: item.approvedQuantity,
    };
  });

  return {
    _id: request._id,
    cafeId: request.cafeId,
    requestedBy: request.requestedBy,
    requesterName: userMap.get(request.requestedBy.toHexString()),
    items,
    reason: request.reason,
    priority: request.priority,
    status: request.status,
    reviewedBy: request.reviewedBy,
    reviewerName: request.reviewedBy
      ? userMap.get(request.reviewedBy.toHexString())
      : undefined,
    reviewedAt: request.reviewedAt,
    reviewNote: request.reviewNote,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  };
}

export async function reviewPendingInternalPurchaseRequest(
  requestId: ObjectId,
  items: InternalPurchaseRequestItem[],
  status: Exclude<InternalPurchaseRequestStatus, "pending" | "cancelled">,
  reviewedBy: ObjectId,
  reviewedAt: Date,
  reviewNote?: string,
): Promise<InternalPurchaseRequest | null> {
  const collection = await getDomainCollection("internalPurchaseRequests");
  const update: UpdateFilter<InternalPurchaseRequest> = {
    $set: {
      items,
      status,
      reviewedBy,
      reviewedAt,
      updatedAt: reviewedAt,
      ...(reviewNote !== undefined ? { reviewNote } : {}),
    },
    ...(reviewNote === undefined
      ? { $unset: { reviewNote: "" as const } }
      : {}),
  };

  return collection.findOneAndUpdate(
    { _id: requestId, status: "pending" },
    update,
    { returnDocument: "after" },
  );
}

