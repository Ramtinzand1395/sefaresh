import "server-only";

import type { ObjectId } from "mongodb";
import { objectIdSchema } from "@/domain/schemas/common";
import { respondToSupplierRequestInputSchema } from "@/domain/schemas/purchasing";
import type {
  RespondToSupplierRequestInput,
  SupplierRequestResponseStatus,
} from "@/domain/types";
import {
  findSupplierRequestForSupplier,
  getSupplierRequestDetailForSupplier,
  getSupplierRequestInbox,
  updateSupplierRequestResponse,
  type SupplierRequestDetailItem,
  type SupplierRequestInboxItem,
} from "@/repositories/supplier-request-repository";

export type SupplierRequestServiceErrorCode =
  | "SUPPLIER_REQUEST_NOT_FOUND_OR_FORBIDDEN"
  | "SUPPLIER_REQUEST_EXPIRED"
  | "INVALID_PARTIAL_QUANTITY"
  | "SUPPLIER_REQUEST_CHANGED";

export class SupplierRequestServiceError extends Error {
  constructor(
    public readonly code: SupplierRequestServiceErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "SupplierRequestServiceError";
  }
}

export type SupplierRequestResponseResult = {
  supplierRequestId: ObjectId;
  requestItemId: ObjectId;
  status: SupplierRequestResponseStatus;
  offeredPrice?: number;
  availableQuantity?: number;
  deliveryDays?: number;
  note?: string;
  respondedAt: Date;
  updatedAt: Date;
};

export async function getSupplierRequests(
  supplierIdInput: string | ObjectId,
): Promise<SupplierRequestInboxItem[]> {
  const supplierId = objectIdSchema.parse(supplierIdInput);
  return getSupplierRequestInbox(supplierId);
}

export async function getSupplierRequestDetail(
  supplierRequestIdInput: string | ObjectId,
  supplierIdInput: string | ObjectId,
): Promise<SupplierRequestDetailItem | null> {
  const supplierRequestId = objectIdSchema.parse(supplierRequestIdInput);
  const supplierId = objectIdSchema.parse(supplierIdInput);
  return getSupplierRequestDetailForSupplier(supplierRequestId, supplierId);
}

export async function respondToSupplierRequest(
  input: RespondToSupplierRequestInput,
): Promise<SupplierRequestResponseResult> {
  const parsedInput = respondToSupplierRequestInputSchema.parse(input);
  const existingRequest = await findSupplierRequestForSupplier(
    parsedInput.supplierRequestId,
    parsedInput.supplierId,
  );

  if (!existingRequest) {
    throw new SupplierRequestServiceError(
      "SUPPLIER_REQUEST_NOT_FOUND_OR_FORBIDDEN",
      "Supplier request was not found for this supplier.",
    );
  }

  if (existingRequest.status === "expired") {
    throw new SupplierRequestServiceError(
      "SUPPLIER_REQUEST_EXPIRED",
      "Expired supplier requests cannot receive a response.",
    );
  }

  if (
    parsedInput.status === "partially_available" &&
    parsedInput.availableQuantity >= existingRequest.requestedQuantity
  ) {
    throw new SupplierRequestServiceError(
      "INVALID_PARTIAL_QUANTITY",
      "A partial response must offer less than the requested quantity.",
    );
  }

  const updatedRequest = await updateSupplierRequestResponse(
    parsedInput.supplierRequestId,
    parsedInput.supplierId,
    existingRequest.requestedQuantity,
    {
      status: parsedInput.status,
      offeredPrice: parsedInput.offeredPrice,
      availableQuantity: parsedInput.availableQuantity,
      deliveryDays: parsedInput.deliveryDays,
      note: parsedInput.note,
    },
    new Date(),
  );

  if (!updatedRequest) {
    throw new SupplierRequestServiceError(
      "SUPPLIER_REQUEST_CHANGED",
      "Supplier request changed before the response could be saved.",
    );
  }

  return {
    supplierRequestId: updatedRequest._id,
    requestItemId: updatedRequest.requestItemId,
    status: parsedInput.status,
    offeredPrice: updatedRequest.offeredPrice,
    availableQuantity: updatedRequest.availableQuantity,
    deliveryDays: updatedRequest.deliveryDays,
    note: updatedRequest.note,
    respondedAt: updatedRequest.respondedAt ?? updatedRequest.updatedAt,
    updatedAt: updatedRequest.updatedAt,
  };
}
