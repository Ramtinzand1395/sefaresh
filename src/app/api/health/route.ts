import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getMongoClient } from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await getMongoClient();
    await client.db("admin").command({ ping: 1 });

    return NextResponse.json({ ok: true, database: "connected" });
  } catch (error) {
    const configurationError = error instanceof ZodError;

    return NextResponse.json(
      {
        ok: false,
        database: "disconnected",
        error: configurationError
          ? "متغیر MONGODB_URI تنظیم نشده یا نامعتبر است."
          : "اتصال به MongoDB برقرار نشد.",
      },
      { status: configurationError ? 503 : 500 },
    );
  }
}
