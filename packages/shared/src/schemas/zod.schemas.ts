import * as z from "zod";

export const SignupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5, "Password must be at least 5 characters"),
});
