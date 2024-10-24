import { User } from "@/lib/db/models";
import { connectToMongoDB } from "@/lib/db/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToMongoDB();

    const users = await User.find({});

    return NextResponse.json({
      message: "Fetched users",
      user: users,
    });
  } catch (error) {
    console.log("Error fetching users", error);
    return NextResponse.json({
      message: "Error fetching users",
    });
  }
}

export async function POST(request: Request) {
  try {
    const { username, password, email, avatar } = await request.json();

    await connectToMongoDB();

    const newUser = new User({
      username,
      password,
      email,
      avatar,
      isOnline: true,
    });

    await newUser.save();
    return NextResponse.json({
      message: "Created user",
      user: newUser,
    });
  } catch (error) {
    console.log("Error creating user", error);
    return NextResponse.json({
      message: "Error creating user",
    });
  }
}
