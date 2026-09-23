import "server-only";

import { MongoClient, type Db } from "mongodb";
import { getServerEnv } from "@/lib/env";

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

let mongoClientPromise: Promise<MongoClient> | undefined;

function createMongoClient() {
  const { MONGODB_URI } = getServerEnv();
  return new MongoClient(MONGODB_URI).connect();
}

export function getMongoClient() {
  if (process.env.NODE_ENV === "development") {
    global.mongoClientPromise ??= createMongoClient();
    return global.mongoClientPromise;
  }

  mongoClientPromise ??= createMongoClient();
  return mongoClientPromise;
}

export async function getDatabase(): Promise<Db> {
  const client = await getMongoClient();
  return client.db();
}
