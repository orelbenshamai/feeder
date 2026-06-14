import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

/** Lazily connects so `next build` does not require MONGODB_URI at module load. */
export default function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("Please define MONGODB_URI in your .env.local");
  }

  if (clientPromise) {
    return clientPromise;
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri, options).connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    clientPromise = new MongoClient(uri, options).connect();
  }

  return clientPromise;
}
