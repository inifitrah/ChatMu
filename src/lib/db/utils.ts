import { cache } from "react";
import { connectToDB } from "./mongodb";
import { User } from "./models/user.model";

const connectDB = cache(async () => {
  await connectToDB();
});

export const getUser = cache(async () => {
  await connectDB();

  const users = await User.find({});
  return users;
});
