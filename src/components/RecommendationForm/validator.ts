import { z } from "zod";

export const MAX_FILE_SIZE_MB = 5;
export const ACCEPTED_IMAGE_FORMATS = [
  "image/png",
  "image/jpeg",
  "image/heic",
  "image/heif",
];

export const imageValidator = z
  .any()
  .refine(
    (file) => file?.size <= MAX_FILE_SIZE_MB * 1024 * 1024,
    `Image size exceeds maximum size of ${MAX_FILE_SIZE_MB}Mb`
  )
  .refine(
    (file) => ACCEPTED_IMAGE_FORMATS.includes(file?.type),
    "Image format is not supported"
  )
  .transform((file) => file as File);

export const recommendationFormSchema = z.object({
  images: imageValidator.array(),
});

export type RecommendationFormSchema = z.infer<typeof recommendationFormSchema>;
