"use server";

import { searchUsersByUsername } from "@chatmu/database";
import { Conversation, Message } from "@chatmu/database";
import { connectToMongoDB } from "@chatmu/database";
const configDBconnection = {
    mongo: {
        uri: process.env.MONGODB_URI as string,
        db: process.env.MONGO_DB as string,
        password: process.env.MONGO_PASSWORD as string,
        user: process.env.MONGO_USER as string,
    }
}


import { IConversation } from "@chatmu/shared";

export const searchConversations = async (
  username: string,
  currentUserId: string
): Promise<IConversation[]> => {
  try {
    if (username.trim() === "") {
      return [];
    }

    await connectToMongoDB(configDBconnection);
    const users = await searchUsersByUsername(username, [
      "username",
      "image",
    ]).then((users) =>
      // Filter out the current user from the search results
      users.filter((user) => user._id.toString() !== currentUserId)
    );

    if (users.length === 0) {
      throw new Error("No users found");
    }

    // Get conversations for the current user
    const conversations = await Conversation.find({
      participants: currentUserId,
    })
      .populate("participants", "username image")
      .populate("lastMessage", "sender content timestamp")
      .exec();

    const result = await Promise.all(
      users.map(async (user) => {
        const conversation = conversations.find((chat) =>
          chat.participants.some(
            (partis: any) => partis._id.toString() === user._id.toString()
          )
        );

        if (!conversation) {
          return {
            otherUserId: user._id,
            profileImage: user.image || null,
            username: user.username,
          };
        }

        const getMessage = async () => {
          if (!conversation.lastMessage) {
            return null;
          }

          return {
            isCurrentUser:
              conversation.lastMessage.sender.toString() === currentUserId,
            lastMessageTime: conversation.lastMessage.timestamp,
            lastMessageContent: conversation.lastMessage.content,
            unreadMessageCount: conversation
              ? await Message.countDocuments({
                  conversationId: conversation._id,
                  sender: { $ne: currentUserId },
                  status: { $ne: "read" },
                })
              : 0,
          };
        };

        return {
          id: conversation._id,
          otherUserId: user._id,
          profileImage: user?.image || null,
          username: user.username,
          message: await getMessage(),
        };
      })
    );

    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error("Error searching conversations:", error);
    throw new Error("Error searching conversations");
  }
};

export const getConversations = async (
  currentUserId: string
): Promise<IConversation[]> => {
  await connectToMongoDB(configDBconnection);
  const conversations = await Conversation.find({ participants: currentUserId })
    .populate("participants", "username image")
    .populate("lastMessage", "content timestamp status sender")
    .exec();

  const result = await Promise.all(
    conversations.map(async (conversation) => {
      const otherUser = conversation.participants.find(
        (p: any) => p._id.toString() !== currentUserId
      );

      if(!otherUser){
        return null;
      }

      const lastMessage = conversation.lastMessage as any;

      return {
        conversationId: conversation._id,
        otherUserId: otherUser._id,
        profileImage: otherUser.image || null,
        username: otherUser.username,
        message: lastMessage ? {
          isCurrentUser: lastMessage.sender?.toString() === currentUserId,
          lastMessageTime: lastMessage.timestamp || null,
          lastMessageContent: lastMessage.content || null,
          unreadMessageCount: await Message.countDocuments({
            conversationId: conversation._id,
            sender: { $ne: currentUserId },
            status: { $ne: "read" },
          }),
          status: lastMessage.status || "sent",
        } : null,
      };
    })
  );

  return JSON.parse(JSON.stringify(result.filter(Boolean)));
};

export const getMessages = async (conversationId: string, userId: string) => {
  await connectToMongoDB(configDBconnection);
  const messages = await Message.find({ conversationId })
    .populate("sender", "username")
    .sort({ timestamp: 1 });

  // Get conversation to find recipient
  const conversation = await Conversation.findById(conversationId)
    .populate("participants", "username");

  const participants = conversation?.participants || [];
  const otherUser = participants.find((p: any) => p._id.toString() !== userId);

  const result = messages.map((message) => {
    const senderDoc = message.sender as any;
    const senderId = senderDoc._id ? senderDoc._id.toString() : message.sender.toString();
    return {
      id: message._id.toString(),
      conversationId,
      sender: {
        id: senderId,
        username: senderDoc.username || "",
      },
      recipient: {
        id: otherUser?._id.toString() || "",
        username: otherUser?.username || "",
      },
      content: message.content,
      type: "text",
      status: message.status || "sent",
      isCurrentUser: senderId === userId,
      timeStamp: message.timestamp || new Date(),
    };
  });

  return JSON.parse(JSON.stringify(result));
};

export const getOrCreateConversation = async (
  currentUserId: string,
  otherUserId: string
) => {
  await connectToMongoDB(configDBconnection);
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
  await connectToMongoDB(configDBconnection);
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
