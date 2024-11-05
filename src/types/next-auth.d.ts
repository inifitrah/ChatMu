// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface SignIn {
    profile: {
      email: string;
      email_verified: boolean;
      image: string;
    };
  }
  interface Session {
    user: {
      username: string;
      id: string;
    } & DefaultSession["user"];
  }
}
