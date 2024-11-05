// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth/next";

declare module "next-auth" {
  //  add custom interface for Profile, Account, Sessions, User and etc.

  interface User {
    email: string;
  }
  interface Session {
    user: {
      id: string;
      username: string;
    } & DefaultSession["user"];
  }
}
