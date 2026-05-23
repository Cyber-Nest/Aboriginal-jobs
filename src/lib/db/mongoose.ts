/**
 * MongoDB connection setup using Mongoose
 * Simplified for Next.js — reads directly from process.env
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env"
  );
}

// Global cache (prevents multiple connections in dev/hot reload)
let cached = (
  global as typeof globalThis & {
    mongoose?: {
      conn: typeof mongoose | null;
      promise: Promise<typeof mongoose> | null;
    };
  }
).mongoose;

if (!cached) {
  cached = (globalThis as any).mongoose = {
    conn: null,
    promise: null,
  };
}

/**
 * Connect to MongoDB
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI!, {
      dbName: process.env.MONGODB_DB_NAME || "aboriginal_jobs",
    });
  }

  cached!.conn = await cached!.promise;

  return cached!.conn;
}

/**
 * Close MongoDB connection
 */
export async function closeConnection(): Promise<void> {
  await mongoose.connection.close();
}

/**
 * Test MongoDB connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    await connectDB();
    return mongoose.connection.readyState === 1;
  } catch {
    return false;
  }
}
