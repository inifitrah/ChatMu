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
        console.log(" ==> Creating new user");

        const username =
          profile.email.split("@")[0] + Math.floor(Math.random() * 1234);

        const newUser = new User({
          email: profile.email,
          username,
          avatar: profile.image,
        });
        await newUser.save();

        return true;
      } else {
        console.log(" ==> User already exists");
      }

      return true;
    },
    async session({ session }) {
      await connectToMongoDB();

      const userData = await User.findOne({ email: session.user.email });

      session.user.id = userData._id;
      session.user.username = userData.username;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
