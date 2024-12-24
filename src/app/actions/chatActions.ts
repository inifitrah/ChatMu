"use server";

import { getUserById, searchUsersByUsername } from "@/data-access/user";
import { socket } from "@/lib/socket";

export const searchChats = async (username: string) => {
  const user = await searchUsersByUsername(username);
  return JSON.parse(JSON.stringify(user));
};

export const getConversation = async (userId: string) => {
  const user = await getUserById(userId);
  return JSON.parse(JSON.stringify(user));
};
