import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { deleteFromCloudinary } from "@/app/lib/cloudinary";
import { apiSuccess, apiError } from "@/app/lib/api-response";

async function handler(request: Request) {
  const { publicId, resourceType } = await request.json();

  if (typeof publicId !== "string") {
    return apiError("Missing publicId.", 400);
  }

  await deleteFromCloudinary(publicId, resourceType === "video" ? "video" : "image");
  return apiSuccess({ ok: true });
}

// verifySignatureAppRouter reads QSTASH_CURRENT_SIGNING_KEY/QSTASH_NEXT_SIGNING_KEY
// eagerly at import time, which would crash the build before those are set up.
// Fall back to an explicit 503 until the real keys are in place.
const hasQstashKeys =
  !!process.env.QSTASH_CURRENT_SIGNING_KEY && !!process.env.QSTASH_NEXT_SIGNING_KEY;

export const POST = hasQstashKeys
  ? verifySignatureAppRouter(handler)
  : async () =>
      apiError("QStash signing keys are not configured yet.", 503);
