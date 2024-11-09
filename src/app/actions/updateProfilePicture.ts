"use server";

import { User } from "@/lib/db/models";
import { connectToMongoDB } from "@/lib/db/mongodb";
import { revalidatePath } from "next/cache";

export default async function updateProfilePicture(formData) {
  try {
    const file = formData.get("file");

    console.log(file);
  } catch (error) {
    console.log(" ERROR from updateProfilePicture ==> ", error);
  }
}
