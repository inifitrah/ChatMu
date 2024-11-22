"use server";

import { SignupSchema } from "@/schemas/zod.schemas";
import * as z from "zod";

export async function createUser(values: z.infer<typeof SignupSchema>) {
  try {
    console.log("values", values);
    const validatedFields = SignupSchema.safeParse(values);
    console.log({ validatedFields });

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid fields",
      };
    }

    return {
      success: true,
      message: "User created",
    };
  } catch (e) {
    return {
      success: false,
      message: "Failed create dari server action",
    };
  }
}
