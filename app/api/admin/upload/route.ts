import { NextResponse } from "next/server";
import { createUploadSignature } from "@/app/lib/cloudinary";
import { UPLOAD_FOLDERS, type UploadFolder } from "@/app/lib/upload-folders";

const VALID_FOLDERS = new Set<string>(Object.values(UPLOAD_FOLDERS));

export async function POST(request: Request) {
  const { folder } = await request.json();

  if (typeof folder !== "string" || !VALID_FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Invalid upload folder." }, { status: 400 });
  }

  const signature = createUploadSignature(folder as UploadFolder);
  return NextResponse.json(signature);
}
