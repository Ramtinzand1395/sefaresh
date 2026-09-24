import "server-only";

import type { ObjectId } from "mongodb";
import type { CafeMember } from "@/domain/types";
import { getDomainCollection } from "@/repositories/domain-collections";

export async function findActiveCafeMember(
  cafeId: ObjectId,
  userId: ObjectId,
): Promise<CafeMember | null> {
  const collection = await getDomainCollection("cafeMembers");
  return collection.findOne({ cafeId, userId, isActive: true });
}
