"use server";
import { updateUser } from "@chatmu/database";
import {
  deleteVerificationToken,
  getVerificationTokenByToken,
} from "@chatmu/database";
import { connectToMongoDB } from "@chatmu/database";


export async function verifyEmail(token: string) {
const configDBconnection = {
  mongo: {
    uri: process.env.MONGODB_URI as string,
    db: process.env.MONGODB_DB_NAME as string,
    password: process.env.MONGODB_PASSWORD as string,
    user: process.env.MONGO_USER as string,
  },
};
  await connectToMongoDB(configDBconnection);
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
