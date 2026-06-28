import { z } from "zod";

export const frequencyFormSchema = z.object({
  email: z.string(),
  recurringMonthly: z.boolean(),
});

export type FrequencyFormSchema = z.infer<typeof frequencyFormSchema>;
