"use server";

import { searchUsersByUsername } from "@/data-access/user";
import { Conversation, Message } from "@/lib/db/models/conversation";
import { connectToMongoDB } from "@/lib/db/mongodb";
import { IConversation } from "@/types/conversation";

export const searchConversations = async (
  username: string,
  currentUserId: string
) => {
  await connectToMongoDB();
  const users = await searchUsersByUsername(username, ["username", "image"]);

  const conversations = await Conversation.find({ participants: currentUserId })
    .populate("participants", "username image")
    .populate("lastMessage", "text timestamp")
    .exec();

  const result = await Promise.all(
    users.map(async (user) => {
      const conversation = conversations.find((c) =>
        c.participants.some(
          (p: typeof c.participants) => p._id.toString() === user._id.toString()
        )
      );

      return {
        targetId: user._id,
        profileImage: user?.image || null,
        username: user.username,
        lastMessageTime: conversation?.lastMessage?.timestamp || null,
        lastMessageContent: conversation?.lastMessage?.text || null,
        unreadMessageCounte: conversation
          ? await Message.countDocuments({
              conversationId: conversation._id,
              sender: { $ne: currentUserId },
              status: { $ne: "read" },
            })
          : 0,
      };
    })
  );

  return JSON.parse(JSON.stringify(result));
};

export const getConversations = async (
  userId: string
): Promise<IConversation[]> => {
  await connectToMongoDB();
  const conversations = await Conversation.find({ participants: userId })
    .populate("participants", "username image")
    .populate("lastMessage", "text timestamp")
    .exec();

  const result = await Promise.all(
    conversations.map(async (conversation) => {
      const otherUser = conversation.participants.find(
        (p: any) => p._id.toString() !== userId
      );

      const lastMessage = conversation.lastMessage
        ? await Message.findById(conversation.lastMessage).exec()
        : null;

      return {
        id: conversation._id,
        otherUserId: otherUser._id,
        profileImage: otherUser.image || null,
        username: otherUser.username,
        message: {
          isCurrentUser: lastMessage?.sender.toString() === userId,
          lastMessageTime: conversation.lastMessage?.timestamp || null,
          lastMessageContent: lastMessage?.content || null,
          unreadMessageCount: await Message.countDocuments({
            conversationId: conversation._id,
            sender: { $ne: userId },
            status: { $ne: "read" },
          }),
          status: lastMessage?.status || "sent",
        },
      };
    })
  );

  return JSON.parse(JSON.stringify(result));
};

export const getMessages = async (conversationId: string, userId: string) => {
  await connectToMongoDB();
  const messages = await Message.find({ conversationId });
  const result = messages.map((message) => {
    return {
      content: message.content,
      isCurrentUser: message.sender.toString() === userId,
      type: "text",
      status: message.status,
    };
  });

  return JSON.parse(JSON.stringify(result));
};

export const getOrCreateConversation = async (
  currentUserId: string,
  otherUserId: string
) => {
  await connectToMongoDB();
  let conversation = await Conversation.findOne({
    participants: { $all: [currentUserId, otherUserId] },
  }).populate("participants", "username image");

  if (!conversation) {
    conversation = new Conversation({
      participants: [currentUserId, otherUserId],
    });
    await conversation.save();
  }

  const findOtherUser = conversation.participants.find(
    (user: any) => user._id.toString() !== currentUserId
  );

  return JSON.parse(
    JSON.stringify({ _id: conversation._id, user: findOtherUser })
  );
};

export const saveNewMessage = async (
  conversationId: string,
  senderId: string,
  content: string
) => {
  await connectToMongoDB();
  const newMessage = new Message({ conversationId, sender: senderId, content });
  await Conversation.updateOne(
    { _id: conversationId },
    { lastMessage: newMessage._id },
    { new: true }
  );
  await newMessage.save();
};

export const markMessagesAsRead = async (
  conversationId: string,
  userId: string
) => {
  await Message.updateMany(
    { conversationId, sender: userId },
    { status: "read" }
  );
};
