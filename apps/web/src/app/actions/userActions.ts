"use server";

import { SignupSchema } from "@chatmu/shared";
import * as z from "zod";
import bcrypt from "bcryptjs";
import {
  generateUniqueUsername,
  generateVerificationToken,
} from "@chatmu/database";
import { sendVerificationEmail } from "@/lib/resend/mail";
import {
  isUserExists,
  createUser as createUserInDB,
  updateUser,
  searchUsersByUsername,
} from "@chatmu/database";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import { connectToMongoDB } from "@chatmu/database";

export async function createUser(values: z.infer<typeof SignupSchema>) {

  const configDBconnection = {
    mongo: {
      uri: process.env.MONGODB_URI as string,
      db: process.env.MONGODB_DB_NAME as string,
      password: process.env.MONGODB_PASSWORD as string,
      user: process.env.MONGO_USER as string,
    },
  };

  await connectToMongoDB(configDBconnection);
  try {
    const validatedFields = SignupSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid fields",
      };
    }

    const { name, email, password } = validatedFields.data;

    //check if user already exists
    const userExists = await isUserExists({ email });
    if (!!userExists) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // create new user
    const newUser = await createUserInDB({
      name,
      username: await generateUniqueUsername(name),
      email,
      password: hash,
      role: "USER",
      emailVerified: null,
    });

    //send verification email
    const token = await generateVerificationToken(newUser.email);
    await sendVerificationEmail(token.email, token.token);

    return {
      success: true,
      message:
        "Sign up success. Please check your email to verify your account",
    };
  } catch (e) {
    return {
      success: false,
      message: "Failed create dari server action",
    };
  }
}

export async function updateProfile({
  name,
  email,
  username,
}: {
  name: string;
  email: string;
  username: string;
}) {
  await connectToMongoDB({
    mongo: {
      uri: process.env.MONGODB_URI as string,
      db: process.env.MONGODB_DB_NAME as string,
      password: process.env.MONGODB_PASSWORD as string,
      user: process.env.MONGO_USER as string,
    }
  });
  try {
    const update = await updateUser(
      { email },
      {
        name,
        username,
      }
    );

    revalidatePath("/profile");

    return JSON.parse(JSON.stringify(update));
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update profile");
  }
}

type UpdateProfilePicture = {
  formData: FormData;
  userId: string;
};

export async function updateProfilePicture({
  formData,
  userId,
}: UpdateProfilePicture) {
  await connectToMongoDB({
    mongo: {
      uri: process.env.MONGODB_URI as string,
      db: process.env.MONGODB_DB_NAME as string,
      password: process.env.MONGODB_PASSWORD as string,
      user: process.env.MONGO_USER as string,
    }
  });
  try {
    const file = formData.get("file") as File;

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
      const update = await updateUser(
        { _id: userId },
        {
          image: (await result).secure_url,
        }
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
  } catch (error) {
    console.log(" ERROR from updateProfilePicture ==> ", error);
  }
}

export async function searchUsers(query: string) {
  await connectToMongoDB({
    mongo: {
      uri: process.env.MONGODB_URI as string,
      db: process.env.MONGODB_DB_NAME as string,
      password: process.env.MONGODB_PASSWORD as string,
      user: process.env.MONGO_USER as string,
    }
  });
  if (!query || !query.trim()) return [];
  try {
    const users = await searchUsersByUsername(query.trim(), [
      "_id",
      "username",
      "name",
      "image",
    ]);
    return users.map((u: any) => ({
      id: String(u._id),
      username: u.username,
      name: u.name || "",
      image: u.image || undefined,
    }));
  } catch (e) {
    console.error("searchUsers error", e);
    return [];
  }
}
