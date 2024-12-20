import { VerificationToken } from "@/lib/db/models/auth";

// Create a new verification token
export const createVerificationToken = async (tokenData: {
  token: string;
  email: string;
  expires: Date;
}) => {
  const verificationToken = new VerificationToken(tokenData);
  return await verificationToken.save();
};

// Get a verification token by token string
export const getVerificationTokenByToken = async (token: string) => {
  return await VerificationToken.findOne({ token });
};

// Get a verification token by email
export const getVerificationTokenByEmail = async (email: string) => {
  return await VerificationToken.findOne({ email });
};

// Update a verification token by token string
export const updateVerificationToken = async (
  token: string,
  updateData: Partial<{ token: string; email: string; expires: Date }>
) => {
  return await VerificationToken.findOneAndUpdate({ token }, updateData, {
    new: true,
  });
};

// Delete a verification token by token string
export const deleteVerificationToken = async (token: string) => {
  return await VerificationToken.deleteOne({ token });
};
