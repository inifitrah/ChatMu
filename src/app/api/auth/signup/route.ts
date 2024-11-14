import { User } from "@/lib/db/models";
import { connectToMongoDB } from "@/lib/db/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return NextResponse.json({
    message: "From signup route",
  });
}

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  async function generateUniqueUsername(email: string) {
    const emailParts = email.split("@");
    const baseUsername = emailParts[0].toLowerCase();
    let candidateUsername = baseUsername;

    if (candidateUsername) {
      return await connectToMongoDB().then(async () => {
        const checkExistingUsername = await User.exists({
          username: candidateUsername,
        });

        if (checkExistingUsername === null) {
          return candidateUsername;
        }

        const generateRandomSuffix = (attempt: number) => {
          const maxRange = Math.pow(10, 2 + attempt);
          return Math.floor(Math.random() * maxRange);
        };

        let attempt = 0;
        const MAX_ATTEMPTS = 10;
        while (attempt < MAX_ATTEMPTS) {
          candidateUsername = `${baseUsername}${generateRandomSuffix(attempt)}`;
          const checkExistingUsername = await User.exists({
            username: candidateUsername,
          });

          if (checkExistingUsername === null) {
            console.log({ attempt });
            return candidateUsername;
          }

          attempt++;
        }

        throw new Error("Cannot generate unique username");
      });
    }

    //   let candidateUsername =
    //     email.split("@")[0] + Math.floor(Math.random() * 1234);
    //   await connectToMongoDB();
    //   const checkExistingUsername = await User.exists({
    //     username: candidateUsername,
    //   });

    //   if (checkExistingUsername) {
    //     candidateUsername = candidateUsername + Math.floor(Math.random() * 4322);
    //   } else {
    //     console.log("Not existed");
    //   }
    //   return candidateUsername;
  }

  console.log("Username", await generateUniqueUsername(email));

  // const newUser = new User({
  //   name,
  //   username: await generateUsernameUniqueWithEmail(email),
  //   email,
  // });

  return NextResponse.json({
    message: "Success created",
  });
}
