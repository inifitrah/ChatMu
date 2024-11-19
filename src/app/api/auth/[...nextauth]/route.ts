import { User } from "@/lib/db/models/auth";
import { connectToMongoDB } from "@/lib/db/mongodb";
import { AuthOptions } from "next-auth";
import NextAuth, { getServerSession } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { mongooseAdapter } from "@/lib/mongoose-adapter";

export const authOptions: AuthOptions = {
  adapter: mongooseAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
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
          name: user.name,
          email: user.email,
          username,
          avatar: user.image,
        });
        await newUser.save();

        return true;
      } else {
        console.log(" ==> User already exists");
        let updated = false;

        if (!existingUser.name) {
          existingUser.name = user.name;
          updated = true;
        }
        if (!existingUser.username) {
          existingUser.username =
            user.email.split("@")[0] + Math.floor(Math.random() * 1234);
          updated = true;
        }
        if (!existingUser.avatar) {
          existingUser.avatar = user.image;
          updated = true;
        }

        if (updated) {
          await existingUser.save();
          console.log(" ==> User data updated");
        }
      }

      return true;
    },

    async session({ session, token }) {
      await connectToMongoDB();
      const userData = await User.findOne({ email: token.email });

      const user = {
        id: userData._id,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        image: userData.avatar,
      };
      session.user = user;

      return JSON.parse(JSON.stringify(session));
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
