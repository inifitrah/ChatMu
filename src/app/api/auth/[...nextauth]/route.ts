import { User } from "@/lib/db/models/auth";
import { AuthOptions } from "next-auth";
import NextAuth, { getServerSession } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { clientMongoose } from "@/lib/db/mongodb";
import { LoginSchema } from "@/schemas/zod.schemas";
import { compare } from "bcryptjs";
export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },

  adapter: MongoDBAdapter(clientMongoose),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }
        const { email, password } = validatedFields.data;

        const user = await User.findOne({ email });
        if (!user || !user.password) return null;
        // compare password
        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) return null;

        console.log("User from route authorize", user);

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log("User from route signIn", user);
      return true;
    },
    async session({ session, token }) {
      const user = await User.findOne({ email: token.email });

      if (user) {
        session.user.image = user.image;
        session.user.username = user.username;
      }
      console.log("Session from route session", session);

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
