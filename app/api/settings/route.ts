import { prisma } from "@/app/lib/prisma";
import { isAdminRequest } from "@/app/lib/require-admin";
import { scheduleCloudinaryCleanup } from "@/app/lib/media-cleanup";
import { apiSuccess, apiError } from "@/app/lib/api-response";

async function getOrCreateSettings() {
  return prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });
}

export async function GET() {
  const settings = await getOrCreateSettings();
  return apiSuccess({
    ...settings,
    // DB value wins if an admin has overridden it; otherwise fall back to
    // the env var so WhatsApp works out of the box with no manual setup.
    whatsappNumber: settings.whatsappNumber || process.env.WHATSAPP_NUMBER || "",
  });
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) {
    return apiError("Unauthorized", 401);
  }
  const body = await request.json();
  const before = await getOrCreateSettings();

  const settings = await prisma.settings.update({
    where: { id: "default" },
    data: {
      whatsappNumber: body.whatsappNumber ?? "",
      whatsappMessageTemplate: body.whatsappMessageTemplate ?? "",
      businessName: body.businessName ?? "",
      businessEmail: body.businessEmail ?? "",
      carouselImages: body.carouselImages ?? [],
      // Blog hero copy is customer-facing — never let it be saved blank.
      blogTitle: body.blogTitle?.trim() || "The Blog",
      blogDescription: body.blogDescription?.trim() || before.blogDescription,
      blogPlaceholderText: body.blogPlaceholderText?.trim() || "Mervida Blog",
    },
  });

  const removed = before.carouselImages.filter((img) => !settings.carouselImages.includes(img));
  await scheduleCloudinaryCleanup(removed);

  return apiSuccess(settings, { message: "Settings saved successfully." });
}
