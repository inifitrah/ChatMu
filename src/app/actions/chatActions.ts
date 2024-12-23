"use server";

import { searchUsersByUsername } from "@/data-access/user";

export const searchChats = async (username: string) => {
  const user = await searchUsersByUsername(username);
  return JSON.parse(JSON.stringify(user));
};
