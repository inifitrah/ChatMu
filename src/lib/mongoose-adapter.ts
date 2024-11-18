import type { Adapter } from "next-auth/adapters";
import {
  User,
  Account,
  Session,
  VerificationToken,
} from "@/lib/db/models/auth";
import generateUniqueUsername from "@/utils/generateUniqueUsername";

export function mongooseAdapter(): Adapter {
  return {
    async createUser(data) {
      console.log(" ==> Creating user in adapter", data);

      const newUser = new User({
        name: data.name,
        email: data.email,
        username: await generateUniqueUsername(data.email),
      });
      await newUser.save();

      return data;
    },
    async createSession(data) {
      console.log(" ==> Creating session in adapter", data);
      return data;
    },
    createVerificationToken(data) {
      return data;
    },
  };
}
