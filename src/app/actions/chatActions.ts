"use server";

import { getUserById, searchUsersByUsername } from "@/data-access/user";
import { Conversation, Message } from "@/lib/db/models/conversation";

export const searchChats = async (username: string, currentUserId: string) => {
  const users = await searchUsersByUsername(username, ["username", "image"]);

  const chats = await Conversation.find({ participants: currentUserId })
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

export const getChatsDetails = async (currentUserId: string) => {
  const chats = await Conversation.find({ participants: currentUserId })
    .populate("participants", "username image")
    .populate("lastMessage", "text timestamp")
    .exec();

  const result = await Promise.all(
    chats.map(async (chat) => {
      const targetUser = chat.participants.find(
        (p: any) => p._id.toString() !== currentUserId
      );

      const lastMessage = chat.lastMessage
        ? await Message.findById(chat.lastMessage).exec()
        : null;

      return {
        targetId: targetUser._id,
        profileImage: targetUser.image || null,
        username: targetUser.username,
        lastMessageTime: chat.lastMessage?.timestamp || null,
        lastMessageContent: lastMessage?.content || null,
        unreadMessageCount: await Message.countDocuments({
          chatId: chat._id,
          sender: { $ne: currentUserId },
          status: { $ne: "read" },
        }),
        status: lastMessage?.status || "sent",
      };
    })
  );

  return JSON.parse(JSON.stringify(result));
};

export const getConversation = async (
  chatId: string,
  currentUserId: string
) => {
  const chat = await Conversation.findOne({ _id: chatId })
    .populate("participants", "username image")
    .exec();

  const targetUser = currentUserId
    ? chat.participants.find((u: any) => u._id.toString() !== currentUserId)
    : null;

  const messages = await Message.find({ chatId });

  const filterMessages = messages.map((message) => {
    return {
      content: message.content,
      isCurrentUser: message.sender.toString() === currentUserId,
    };
  });

  const result = {
    id: JSON.parse(JSON.stringify(targetUser._id)),
    username: targetUser?.username,
    profileImage: targetUser?.image || null,
    messages: JSON.parse(JSON.stringify(filterMessages)),
  };

  return result;
};

export const getOrCreateChat = async (userId1: string, userId2: string) => {
  console.log({ userId1, userId2 });
  let chat = await Conversation.findOne({
    participants: { $all: [userId1, userId2] },
  });
  if (!chat) {
    chat = new Conversation({ participants: [userId1, userId2] });
    await chat.save();
  }
  // console.log({ chat });
  return JSON.parse(JSON.stringify(chat));
};

export const saveNewMessage = async (
  chatId: string,
  senderId: string,
  content: string
) => {
  const newMessage = new Message({ chatId, sender: senderId, content });
  await Conversation.updateOne(
    { _id: chatId },
    { lastMessage: newMessage._id },
    { new: true }
  );
  await newMessage.save();
};
