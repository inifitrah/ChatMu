import { User } from "@/lib/db/models";
import { connectToMongoDB } from "@/lib/db/mongodb";
import generateUniqueUsername from "@/utils/generateUniqueUsername";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return NextResponse.json({
    message: "From signup route",
  });
}

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  const username = await generateUniqueUsername(email);

  await connectToMongoDB();
  const newUser = new User({
    name,
    username,
    password,
    email,
    avatar: null,
    isOnline: false,
  });

  await newUser.save();

  return NextResponse.json({
    message: "Success created",
  });
}
