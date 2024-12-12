"use server";

import { User } from "@/lib/db/models/auth";
import { SignupSchema } from "@/schemas/zod.schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import generateUniqueUsername from "@/utils/generateUniqueUsername";
import { connectToMongoDB } from "@/lib/db/mongodb";
import { generateVerificationToken } from "@/utils/generateVerificationToken";
import { sendVerificationEmail } from "@/lib/resend/mail";

export async function createUser(values: z.infer<typeof SignupSchema>) {
  try {
    const validatedFields = SignupSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid fields",
      };
    }

    const { name, email, password } = validatedFields.data;

    await connectToMongoDB();

    //check if user already exists
    const userExists = await User.exists({ email });
    if (!!userExists) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    // hash password
    bcrypt.genSalt(10, async function (err, salt) {
      if (err) {
        return {
          success: false,
          message: "Failed to create user",
        };
      }

      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) {
          return {
            success: false,
            message: "Failed to create user",
          };
        }

        // create new user
        await User.create({
          name,
          username: await generateUniqueUsername(name),
          email,
          password: hash,
          role: "USER",
          emailVerified: null,
        });
      });
      //send verification email
      const token = await generateVerificationToken(email);
      await sendVerificationEmail(token.email, token.token);
    });

    return {
      success: true,
      message: "Please verify your email, for account activation",
    };
  } catch (e) {
    return {
      success: false,
      message: "Failed create dari server action",
    };
  }
}
