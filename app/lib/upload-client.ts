import { UPLOAD_FOLDERS, type UploadFolder } from "@/app/lib/upload-folders";

export { UPLOAD_FOLDERS };
export type { UploadFolder };

export async function uploadFile(file: File, folder: UploadFolder): Promise<string> {
  const signRes = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });
  const json = await signRes.json();
  const { timestamp, signature, apiKey, cloudName } = json.data ?? json;

  const resourceType = file.type.startsWith("video/") ? "video" : "image";
  const body = new FormData();
  body.append("file", file);
  body.append("api_key", apiKey);
  body.append("timestamp", String(timestamp));
  body.append("signature", signature);
  body.append("folder", folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: "POST", body },
  );
  if (!uploadRes.ok) throw new Error("Upload to Cloudinary failed.");
  const result = await uploadRes.json();
  return result.secure_url as string;
}
