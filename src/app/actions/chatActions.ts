"use server";

import { getUserById, searchUsersByUsername } from "@/data-access/user";
import { Chat, Message } from "@/lib/db/models/chat";

export const searchChats = async (username: string, currentUserId: string) => {
  const users = await searchUsersByUsername(username, ["username", "image"]);

  const chats = await Chat.find({ participants: currentUserId })
    .populate("participants", "username image")
    .populate("lastMessage", "text timestamp")
    .exec();

  const result = await Promise.all(
    users.map(async (user) => {
      const chat = chats.find((c) =>
        c.participants.some(
          (p: typeof c.participants) => p._id.toString() === user._id.toString()
        )
      );

      return {
        targetId: user._id,
        profileImage: user?.image || null,
        username: user.username,
        lastMessageTime: chat?.lastMessage?.timestamp || null,
        lastMessageContent: chat?.lastMessage?.text || null,
        unreadMessageCounte: chat
          ? await Message.countDocuments({
              chatId: chat._id,
              sender: { $ne: currentUserId },
              status: { $ne: "read" },
            })
          : 0,
      };
    })
  );

  return JSON.parse(JSON.stringify(result));
};

export const getConversation = async (
  chatId: string,
  currentUserId: string
) => {
  const chat = await Chat.findOne({ _id: chatId })
    .populate("participants", "username image")
    .exec();

  const targetUser = currentUserId
    ? chat.participants.find((u: any) => u._id.toString() !== currentUserId)
    : null;

  const messages = await Message.find({ chatId });

  const filterMessages = messages.map((message) => {
    return {
      text: message.text,
      isCurrentUser: message.sender.toString() === currentUserId,
    };
  });

  const result = {
    username: targetUser?.username,
    profileImage: targetUser?.image || null,
    messages: JSON.parse(JSON.stringify(filterMessages)),
  };

  return result;
};

export const getOrCreateChat = async (userId1: string, userId2: string) => {
  console.log({ userId1, userId2 });
  let chat = await Chat.findOne({ participants: { $all: [userId1, userId2] } });
  if (!chat) {
    chat = new Chat({ participants: [userId1, userId2] });
    await chat.save();
  }
  // console.log({ chat });
  return JSON.parse(JSON.stringify(chat));
};

export const sendNewMessage = async (
  chatId: string,
  senderId: string,
  text: string
) => {
  const newMessage = new Message({ chatId, sender: senderId, text });
  await Chat.updateOne(
    { _id: chatId },
    { lastMessage: newMessage._id },
    { new: true }
  );
  await newMessage.save();
};
