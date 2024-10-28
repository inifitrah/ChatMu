import { User } from "@/lib/db/models";
import { connectToMongoDB } from "@/lib/db/mongodb";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      await connectToMongoDB();

      const existingUser = await User.findOne({ email: profile.email });

      if (!existingUser) {
        const newUser = new User({
          email: profile.email,
          username: profile.email.split(" ").join("").toLowerCase(),
          avatar: profile.image,
        });
        await newUser.save();

        return true;
      } else {
        console.log(" ==> User already exists");
      }

      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
