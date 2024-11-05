import { User } from "@/lib/db/models";
import { connectToMongoDB } from "@/lib/db/mongodb";
import { AuthOptions } from "next-auth";
import NextAuth, { getServerSession } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await connectToMongoDB();
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        console.log(" ==> Creating new user");
        const username =
          user.email.split("@")[0] + Math.floor(Math.random() * 1234);

        const newUser = new User({
          email: user.email,
          username,
          avatar: user.image,
        });
        await newUser.save();

        return true;
      } else {
        console.log(" ==> User already exists");
      }

      return true;
    },

    async session({ session, token }) {
      await connectToMongoDB();
      const userData = await User.findOne({ email: token.email });
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

export function authServerSession() {
  return getServerSession(authOptions);
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
