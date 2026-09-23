import "server-only";

import type { Collection } from "mongodb";
import {
  collectionNames,
  type DomainCollectionKey,
  type DomainCollections,
} from "@/domain/collections";
import { getDatabase } from "@/lib/mongodb";

export async function getDomainCollection<Key extends DomainCollectionKey>(
  key: Key,
): Promise<Collection<DomainCollections[Key]>> {
  const database = await getDatabase();
  return database.collection<DomainCollections[Key]>(collectionNames[key]);
}
