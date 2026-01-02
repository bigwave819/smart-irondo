import { z } from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9]+$/, "Phone must contain only numbers"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});
