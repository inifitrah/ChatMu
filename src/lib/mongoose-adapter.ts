import type { Adapter } from "next-auth/adapters";
import {
  User,
  Account,
  Session,
  VerificationToken,
} from "@/lib/db/models/auth";

export function mongooseAdapter(): Adapter {
  return {
    createUser: async () => {},
  };
}
