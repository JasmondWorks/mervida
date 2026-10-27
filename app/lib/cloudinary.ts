import { v2 as cloudinary } from "cloudinary";
import type { UploadFolder } from "@/app/lib/upload-folders";

// CLOUDINARY_URL env var is picked up automatically by the SDK.

export { UPLOAD_FOLDERS } from "@/app/lib/upload-folders";
export type { UploadFolder };

export function getCloudName(): string {
  const url = process.env.CLOUDINARY_URL ?? "";
  const match = url.match(/@([^/]+)$/);
  if (!match) throw new Error("CLOUDINARY_URL is not set or malformed");
  return match[1];
}

/**
 * Generates a short-lived signature for a direct browser-to-Cloudinary upload.
 * The browser never sees the API secret; it only gets this signature + timestamp.
 */
export function createUploadSignature(folder: UploadFolder) {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    cloudinary.config().api_secret!,
  );
  return {
    timestamp,
    signature,
    apiKey: cloudinary.config().api_key,
    cloudName: getCloudName(),
    folder,
  };
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" = "image",
) {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export function extractPublicId(cloudinaryUrl: string): string | null {
  const match = cloudinaryUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

export function resourceTypeFromUrl(cloudinaryUrl: string): "image" | "video" {
  return cloudinaryUrl.includes("/video/upload/") ? "video" : "image";
}
