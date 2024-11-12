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
}: UpdateProfilePicture) {
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

    const result = cloudinary.uploader.upload(
      `data:${file.type};base64,${base64}`,
      uploadOptions
    );

    if (result) {
      await connectToMongoDB();

      const update = await User.findOneAndUpdate(
        { _id: userId },
        {
          avatar: (await result).secure_url,
          lastSeen: new Date(),
        },
        { new: true }
      );

      if (update) {
        revalidatePath(`/profile`);
        return {
          success: true,
          message: "Profile picture updated",
        };
      }
    } else {
      return {
        success: false,
        message: "Failed to upload image",
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      success: true,
      message: "Profile picture updated",
    };
  } catch (error) {
    console.log(" ERROR from updateProfilePicture ==> ", error);
  }
}
