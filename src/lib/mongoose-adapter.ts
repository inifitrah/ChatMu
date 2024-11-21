import type { Adapter } from "next-auth/adapters";
import {
  User,
  Account,
  Session,
  VerificationToken,
} from "@/lib/db/models/auth";
import generateUniqueUsername from "@/utils/generateUniqueUsername";

import mongoose from "mongoose";

export function MongooseAdapter(): Adapter {
  return {
    // USER OPERATIONS
    async createUser(userData) {
      if (!userData.username) {
        userData.username = await generateUniqueUsername(userData.email);
      }
      const user = await User.create(userData);
      return {
        id: user._id.toString(),
        ...user.toObject(),
        emailVerified: user.emailVerified?.toISOString() || null,
      };
    },

    async getUser(id) {
      const user = await User.findById(id);
      if (!user) return null;

      return {
        id: user._id.toString(),
        ...user.toObject(),
        emailVerified: user.emailVerified?.toISOString() || null,
      };
    },

    async getUserByEmail(email) {
      const user = await User.findOne({ email });
      if (!user) return null;

      return {
        id: user._id.toString(),
        ...user.toObject(),
        emailVerified: user.emailVerified?.toISOString() || null,
      };
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await Account.findOne({ providerAccountId, provider });
      if (!account) return null;

      const user = await User.findById(account.userId);
      if (!user) return null;

      return {
        id: user._id.toString(),
        ...user.toObject(),
        emailVerified: user.emailVerified?.toISOString() || null,
      };
    },

    async updateUser(userData) {
      const user = await User.findByIdAndUpdate(
        userData.id,
        { $set: userData },
        { new: true }
      );
      if (!user) throw new Error("User not found");

      return {
        id: user._id.toString(),
        ...user.toObject(),
        emailVerified: user.emailVerified?.toISOString() || null,
      };
    },

    async deleteUser(userId) {
      // Delete related data first
      await Promise.all([
        Account.deleteMany({ userId: new mongoose.Types.ObjectId(userId) }),
        Session.deleteMany({ userId: new mongoose.Types.ObjectId(userId) }),
      ]);
      await User.findByIdAndDelete(userId);
    },

    // SESSION OPERATIONS
    async createSession(sessionData) {
      const session = await Session.create({
        ...sessionData,
        userId: new mongoose.Types.ObjectId(sessionData.userId),
      });

      return {
        id: session._id.toString(),
        ...session.toObject(),
        expires: session.expires.toISOString(),
      };
    },

    async getSessionAndUser(sessionToken) {
      const session = await Session.findOne({ sessionToken });
      if (!session) return null;

      const user = await User.findById(session.userId);
      if (!user) return null;

      return {
        session: {
          id: session._id.toString(),
          ...session.toObject(),
          expires: session.expires.toISOString(),
        },
        user: {
          id: user._id.toString(),
          ...user.toObject(),
          emailVerified: user.emailVerified?.toISOString() || null,
        },
      };
    },

    async updateSession(session) {
      const updatedSession = await Session.findOneAndUpdate(
        { sessionToken: session.sessionToken },
        { $set: session },
        { new: true }
      );
      if (!updatedSession) return null;

      return {
        id: updatedSession._id.toString(),
        ...updatedSession.toObject(),
        expires: updatedSession.expires.toISOString(),
      };
    },

    async deleteSession(sessionToken) {
      await Session.findOneAndDelete({ sessionToken });
    },

    // ACCOUNT OPERATIONS
    async linkAccount(accountData) {
      const account = await Account.create({
        ...accountData,
        userId: new mongoose.Types.ObjectId(accountData.userId),
      });

      return {
        id: account._id.toString(),
        ...account.toObject(),
      };
    },

    async unlinkAccount({ providerAccountId, provider }) {
      await Account.findOneAndDelete({ providerAccountId, provider });
    },

    // VERIFICATION TOKEN OPERATIONS
    async createVerificationToken(verificationToken) {
      const token = await VerificationToken.create(verificationToken);
      return {
        id: token._id.toString(),
        ...token.toObject(),
        expires: token.expires.toISOString(),
      };
    },

    async useVerificationToken({ identifier, token }) {
      const verificationToken = await VerificationToken.findOneAndDelete({
        identifier,
        token,
      });
      if (!verificationToken) return null;

      return {
        id: verificationToken._id.toString(),
        ...verificationToken.toObject(),
        expires: verificationToken.expires.toISOString(),
      };
    },
  };
}

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
