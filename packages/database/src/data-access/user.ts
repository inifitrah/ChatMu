import { User } from "../models/auth";

export const getUserByEmail = async (email: string) => {
  const user = await User.findOne({
    email,
  });
  return user;
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id);
  return user;
};

export const searchUsersByUsername = async (
  query: string,
  fields: string[] = []
) => {
  const projection = fields.length > 0 ? fields.join(" ") : "";

  const users = await User.find(
    {
      username: { $regex: query, $options: "i" },
    },
    projection
  );
  return users;
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
  criteria: {
    _id?: string;
    email?: string;
    username?: string;
  },
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
  const user = await User.findOneAndUpdate(criteria, updateData, { new: true });
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
