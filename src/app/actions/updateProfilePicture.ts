"use server";

import { User } from "@/lib/db/models";
import { connectToMongoDB } from "@/lib/db/mongodb";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";

type UpdateProfilePicture = {
  formData: FormData;
  userId: string;
};

export default async function updateProfilePicture({
  formData,
  userId,
}: UpdateProfilePicture): Promise<void> {
  try {
    const file = formData.get("file");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    const uploadOptions = {
      public_id: `user_avatar_${userId}`,
      overwrite: true,
      folder: "avatars",
    };

    cloudinary.uploader
      .upload(`data:${file.type};base64,${base64}`, uploadOptions)
      .then((result) => console.log(result));

    console.log(file);
  } catch (error) {
    console.log(" ERROR from updateProfilePicture ==> ", error);
  }
}
