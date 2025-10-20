import { VerificationToken } from "../models/auth";
import { v4 as uuid } from "uuid";
export async function generateVerificationToken(email: string) {
  const expiresIn = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour
  const existingToken = await VerificationToken.exists({ email: email });

  if (existingToken) {
    const token = await VerificationToken.findOneAndUpdate(
      { _id: existingToken._id },
      { token: uuid(), expires: expiresIn },
      { new: true }
    );
    return token;
  }

  const newToken = new VerificationToken({
    email,
    token: uuid(),
    expires: expiresIn,
  });
  await newToken.save();
  return newToken;
}
