import { extractPublicId, resourceTypeFromUrl } from "@/app/lib/cloudinary";
import { enqueueCloudinaryDeletion } from "@/app/lib/queue";

function isCloudinaryUrl(url: string): boolean {
  return url.includes("res.cloudinary.com");
}

/**
 * Removes the DB reference instantly (caller already did that); this just
 * schedules the slower Cloudinary cleanup for any of the given URLs that
 * are actually hosted there (skips legacy local /images/... paths).
 */
export async function scheduleCloudinaryCleanup(urls: (string | null | undefined)[]) {
  const jobs = urls
    .filter((url): url is string => !!url && isCloudinaryUrl(url))
    .map((url) => {
      const publicId = extractPublicId(url);
      if (!publicId) return null;
      return enqueueCloudinaryDeletion(publicId, resourceTypeFromUrl(url));
    })
    .filter((job) => job !== null);

  await Promise.allSettled(jobs);
}
