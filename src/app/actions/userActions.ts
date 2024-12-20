"use server";

import { SignupSchema } from "@/schemas/zod.schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import generateUniqueUsername from "@/utils/generateUniqueUsername";
import { connectToMongoDB } from "@/lib/db/mongodb";
import { generateVerificationToken } from "@/utils/generateVerificationToken";
import { sendVerificationEmail } from "@/lib/resend/mail";
import { isUserExists, createUser as createUserInDB } from "@/data-access/user";

export async function createUser(values: z.infer<typeof SignupSchema>) {
  try {
    await connectToMongoDB();
    const validatedFields = SignupSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid fields",
      };
    }

    const { name, email, password } = validatedFields.data;

    //check if user already exists
    const userExists = await isUserExists({ email });
    if (!!userExists) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // create new user
    const newUser = await createUserInDB({
      name,
      username: await generateUniqueUsername(name),
      email,
      password: hash,
      role: "USER",
      emailVerified: null,
    });

    //send verification email
    const token = await generateVerificationToken(newUser.email);
    await sendVerificationEmail(token.email, token.token);

    return {
      success: true,
      message:
        "Sign up success. Please check your email to verify your account",
    };
  } catch (e) {
    return {
      success: false,
      message: "Failed create dari server action",
    };
  }
}
