import { Conversation } from "@/lib/db/models";
import { connectToMongoDB } from "@/lib/db/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToMongoDB();

    const userId = "6718e1bac9b7c37002817409";

    const conversation = await Conversation.find({
      participants: userId,
    });

    return NextResponse.json({
      data: conversation,
    });
  } catch (error) {
    console.log("----->", error);
  }
}

export async function POST(request: Request) {
  try {
    await connectToMongoDB();

    const { participants } = await request.json();

    const newConversation = new Conversation({
      participants,
      lastMessage: null,
    });

    await newConversation.save();

    return NextResponse.json({
      success: true,
      data: newConversation,
    });
  } catch (error) {
    console.log("----->", error);
  }
}
