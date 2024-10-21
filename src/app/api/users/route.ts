import { User } from "@/lib/db/models/user.model";
import { connectToDB } from "@/lib/db/mongodb";
import { NextResponse } from "next/server";

// export async function GET() {
//   return NextResponse.json({
//     message: "User route!",
//   });
// }

export async function POST() {
  await connectToDB();
  return NextResponse.json({
    data: "user",
  });
}
