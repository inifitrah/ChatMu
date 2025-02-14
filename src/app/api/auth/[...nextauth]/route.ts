import { User } from "@/lib/db/models/auth";
import { AuthOptions } from "next-auth";
import NextAuth, { getServerSession } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { clientMongoose, connectToMongoDB } from "@/lib/db/mongodb";
import { LoginSchema } from "@/schemas/zod.schemas";
import { compare } from "bcryptjs";
import generateUniqueUsername from "@/utils/generateUniqueUsername";
import { generateVerificationToken } from "@/utils/generateVerificationToken";
import { sendVerificationEmail } from "@/lib/resend/mail";
import { getUserByEmail } from "@/data-access/user";
const authOptions: AuthOptions = {
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
          throw new Error("Invalid Credentials");
        }

        const { email, password } = validatedFields.data;
        await connectToMongoDB();
        const existingUser = await getUserByEmail(email);
        if (!existingUser || !existingUser.password) {
          throw new Error("User not found");
        }

        // compare password
        const passwordMatch = await compare(password, existingUser.password);

        if (!passwordMatch) {
          throw new Error("Email or password is incorrect");
        }

        if (!existingUser.emailVerified) {
          //send verification email
          const token = await generateVerificationToken(email);
          await sendVerificationEmail(token.email, token.token);
          throw new Error("EmailNotVerified");
        }

        return JSON.parse(JSON.stringify(existingUser)); // remove new object_id in user id
      },
    }),
  ],
  events: {
    linkAccount: async ({ user }) => {
      // add emailVerified, username and role to user linked
      await connectToMongoDB();
      await User.findOneAndUpdate(
        { email: user.email },
        {
          emailVerified: new Date(),
          username: await generateUniqueUsername(user.email),
          role: "USER",
        }
      );
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      return true;
    },
    async session({ session, token }) {
      await connectToMongoDB();
      const user = await User.findOne({ email: token.email }).then(
        (user) => JSON.parse(JSON.stringify(user)) // remove new object_id in user id
      );

      if (user) {
        session.user.image = user.image;
        session.user.username = user.username;
        session.user.id = user._id;
      }

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
