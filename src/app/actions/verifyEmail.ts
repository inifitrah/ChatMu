"use server";

import { VerificationToken, User } from "@/lib/db/models/auth";
import { connectToMongoDB } from "@/lib/db/mongodb";

export default async function verifyEmail(token: string) {
  await connectToMongoDB();
  const existingToken = await VerificationToken.findOne({ token });
  if (!existingToken) {
    return { success: false, message: "Invalid token" };
  }

  if (existingToken.expiresAt < new Date()) {
    return { success: false, message: "Token expired" };
  }

  const existingUser = await User.findOneAndUpdate(
    { email: existingToken.email },
    { emailVerified: new Date(), email: existingToken.email },
    { new: true }
  );

  if (!existingUser) return { success: false, message: "User not found" };

  await VerificationToken.deleteOne({ token });

  return {
    success: true,
    message: "Email verified",
    email: existingUser.email,
  };
}
