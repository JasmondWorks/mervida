export const UPLOAD_FOLDERS = {
  productImages: "mervida/products/images",
  productVideos: "mervida/products/manufacturing-videos",
  categoryImages: "mervida/categories",
  blogImages: "mervida/blog",
  siteAssets: "mervida/site",
} as const;

export type UploadFolder = (typeof UPLOAD_FOLDERS)[keyof typeof UPLOAD_FOLDERS];
