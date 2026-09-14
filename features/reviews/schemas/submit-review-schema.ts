import { z } from "zod";

export const submitReviewSchema = z.object({
  productId: z.union([z.string().min(1), z.number()]),
  rating: z.number().int().min(1).max(5),
  customerName: z.string().trim().min(1).max(120),
  size: z.string().trim().max(40).optional().nullable(),
  title: z.string().trim().min(1).max(160),
  comment: z.string().trim().min(1).max(2000),
  locale: z.string().optional(),
});

export type SubmitReviewFormValues = z.infer<typeof submitReviewSchema>;
