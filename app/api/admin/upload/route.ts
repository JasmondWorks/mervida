import { createUploadSignature } from "@/app/lib/cloudinary";
import { UPLOAD_FOLDERS, type UploadFolder } from "@/app/lib/upload-folders";
import { apiSuccess, apiError } from "@/app/lib/api-response";

const VALID_FOLDERS = new Set<string>(Object.values(UPLOAD_FOLDERS));

export async function POST(request: Request) {
  const { folder } = await request.json();

  if (typeof folder !== "string" || !VALID_FOLDERS.has(folder)) {
    return apiError("Invalid upload folder.", 400);
  }

  const signature = createUploadSignature(folder as UploadFolder);
  return apiSuccess(signature);
}
