import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  MONGODB_URI: z
    .string()
    .min(1, "MONGODB_URI الزامی است")
    .refine(
      (value) => value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"),
      "MONGODB_URI باید یک آدرس معتبر MongoDB باشد",
    ),
});

export function getServerEnv() {
  return serverEnvSchema.parse({
    MONGODB_URI: process.env.MONGODB_URI,
  });
}
