import "server-only";

import { MongoClient } from "mongodb";
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
