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
    async createUser(user) {
      console.log("createUser", user);
      return;
    },
    async getUser(id) {
      console.log("getUser", id);
      return;
    },
    async getUserByEmail(email) {
      console.log("getUserByEmail", email);
      return;
    },
    async getUserByAccount({ providerAccountId, provider }) {
      console.log("getUserByAccount", { providerAccountId, provider });
      return;
    },
    async updateUser(user) {
      console.log("updateUser", user);
      return;
    },
    async deleteUser(userId) {
      console.log("deleteUser", userId);
      return;
    },
    async linkAccount(account) {
      console.log("linkAccount", account);
      return;
    },
    async unlinkAccount({ providerAccountId, provider }) {
      console.log("unlinkAccount", { providerAccountId, provider });
      return;
    },
    async createSession({ sessionToken, userId, expires }) {
      console.log("createSession", { sessionToken, userId, expires });
      return;
    },
    async getSessionAndUser(sessionToken) {
      console.log("getSessionAndUser", sessionToken);
      return;
    },
    async updateSession({ sessionToken }) {
      console.log("updateSession", sessionToken);
      return;
    },
    async deleteSession(sessionToken) {
      console.log("deleteSession", sessionToken);
      return;
    },
    async createVerificationToken({ identifier, expires, token }) {
      console.log("createVerificationToken", { identifier, expires, token });
      return;
    },
    async useVerificationToken({ identifier, token }) {
      console.log("useVerificationToken", { identifier, token });
      return;
    },
  };
}
