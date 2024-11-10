import { z } from "zod";

export const verifyvalidation = z.object({
  verifycode: z.string()
    .min(6, "Code should be at least 6 characters")
    .max(6, "Code should be at most 6 characters"),
});
