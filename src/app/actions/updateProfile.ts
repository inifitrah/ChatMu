"use server";

import { User } from "@/lib/db/models";
import { connectToMongoDB } from "@/lib/db/mongodb";
import { revalidatePath } from "next/cache";

export default async function updateProfile({
  name,
  email,
  username,
}: {
  name: string;
  email: string;
  username: string;
}) {
  try {
    await connectToMongoDB();

    const updateUser = await User.findOneAndUpdate(
      { email },
      { name, username },
      { new: true }
    );

    revalidatePath("/profile");

    return JSON.parse(JSON.stringify(updateUser));
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update profile");
  }
}
