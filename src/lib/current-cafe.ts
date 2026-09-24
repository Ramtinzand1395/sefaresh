import "server-only";

import { objectIdSchema } from "@/domain/schemas/common";
import type { CafeMemberRole } from "@/domain/types";
import { findActiveCafeMember } from "@/repositories/cafe-membership-repository";
import type { ObjectId } from "mongodb";

export class CurrentCafeIdentityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CurrentCafeIdentityError";
  }
}

export type CurrentCafeIdentity = {
  cafeId: ObjectId;
  userId: ObjectId;
};

export function getCurrentCafeIdentity(): CurrentCafeIdentity {
  if (process.env.NODE_ENV !== "development") {
    throw new CurrentCafeIdentityError(
      "Cafe identity requires the future authentication adapter outside development.",
    );
  }

  const parsedCafeId = objectIdSchema.safeParse(process.env.SEFARESH_DEV_CAFE_ID);
  if (!parsedCafeId.success) {
    throw new CurrentCafeIdentityError(
      "SEFARESH_DEV_CAFE_ID is missing or invalid.",
    );
  }

  const parsedUserId = objectIdSchema.safeParse(process.env.SEFARESH_DEV_USER_ID);
  if (!parsedUserId.success) {
    throw new CurrentCafeIdentityError(
      "SEFARESH_DEV_USER_ID is missing or invalid.",
    );
  }

  return {
    cafeId: parsedCafeId.data,
    userId: parsedUserId.data,
  };
}

export async function getCurrentCafeMemberRole(): Promise<CafeMemberRole | null> {
  const { cafeId, userId } = getCurrentCafeIdentity();
  const membership = await findActiveCafeMember(cafeId, userId);
  return membership?.role ?? null;
}
