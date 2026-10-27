import { NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { deleteFromCloudinary } from "@/app/lib/cloudinary";

async function handler(request: Request) {
  const { publicId, resourceType } = await request.json();

  if (typeof publicId !== "string") {
    return NextResponse.json({ error: "Missing publicId." }, { status: 400 });
  }

  await deleteFromCloudinary(publicId, resourceType === "video" ? "video" : "image");
  return NextResponse.json({ ok: true });
}

// verifySignatureAppRouter reads QSTASH_CURRENT_SIGNING_KEY/QSTASH_NEXT_SIGNING_KEY
// eagerly at import time, which would crash the build before those are set up.
// Fall back to an explicit 503 until the real keys are in place.
const hasQstashKeys =
  !!process.env.QSTASH_CURRENT_SIGNING_KEY && !!process.env.QSTASH_NEXT_SIGNING_KEY;

export const POST = hasQstashKeys
  ? verifySignatureAppRouter(handler)
  : async () =>
      NextResponse.json(
        { error: "QStash signing keys are not configured yet." },
        { status: 503 },
      );
