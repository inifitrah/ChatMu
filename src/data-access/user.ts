import { User } from "@/lib/db/models/auth";

export const getUserByEmail = async (email: string) => {
  const user = await User.findOne({
    email,
  });
  return user;
};

export const createUser = async (userData: {
  name: string;
  username: string;
  email: string;
  password: string;
  image?: string;
  role?: string;
  emailVerified?: Date | null;
}) => {
  const user = new User(userData);
  await user.save();
  return user;
};

export const updateUser = async (
  userId: string,
  updateData: Partial<{
    name: string;
    username: string;
    email: string;
    password: string;
    image: string;
    role: string;
    emailVerified: Date;
  }>
) => {
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  return user;
};

export const deleteUser = async (userId: string) => {
  await User.findByIdAndDelete(userId);
};

export const isUserExists = async (criteria: {
  id?: string;
  email?: string;
  username?: string;
}) => {
  const exists = await User.exists(criteria);
  return exists;
};
