"use server";
import { updateUser } from "@/data-access/user";
import {
  deleteVerificationToken,
  getVerificationTokenByToken,
} from "@/data-access/verificationToken";
import { connectToMongoDB } from "@/lib/db/mongodb";

export async function verifyEmail(token: string) {
  await connectToMongoDB();
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return { success: false, message: "Invalid token" };
  }

  if (existingToken.expiresAt < new Date()) {
    return { success: false, message: "Token expired" };
  }

  const checkExistingUserAndUpdate = await updateUser(
    { email: existingToken.email },
    { emailVerified: new Date(), email: existingToken.email }
  );

  if (!checkExistingUserAndUpdate)
    return { success: false, message: "User not found" };

  // await VerificationToken.deleteOne({ token });
  await deleteVerificationToken(token);

  return {
    success: true,
    message: "Email verified",
    email: checkExistingUserAndUpdate.email,
  };
}
