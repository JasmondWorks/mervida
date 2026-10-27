import { Client } from "@upstash/qstash";

let client: Client | null = null;

function getClient(): Client {
  if (!client) {
    const token = process.env.QSTASH_TOKEN;
    if (!token) throw new Error("QSTASH_TOKEN is not set");
    client = new Client({ token });
  }
  return client;
}

/**
 * Enqueues the actual Cloudinary deletion. The caller has already removed
 * the DB reference, so the UI updates instantly; this runs the slower
 * third-party cleanup out-of-band via a QStash-triggered callback.
 */
export async function enqueueCloudinaryDeletion(
  publicId: string,
  resourceType: "image" | "video",
) {
  const baseUrl = process.env.APP_URL;
  if (!baseUrl) throw new Error("APP_URL is not set");

  await getClient().publishJSON({
    url: `${baseUrl}/api/jobs/delete-cloudinary-asset`,
    body: { publicId, resourceType },
    retries: 5,
  });
}
