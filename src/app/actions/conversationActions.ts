"use server";

import { searchUsersByUsername } from "@/data-access/user";
import { Conversation, Message } from "@/lib/db/models/conversation";

export const searchConversations = async (
  username: string,
  currentUserId: string
) => {
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

interface IConversation {
  otherUser: string;
  profileImage: string | null;
  username: string;
  lastMessageTime: Date | null;
  lastMessageContent: string | null;
  unreadMessageCount: number;
  status: string;
}

export const getConversations = async (
  userId: string
): Promise<IConversation[]> => {
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
        otherUserId: otherUser._id,
        profileImage: otherUser.image || null,
        username: otherUser.username,
        lastMessageTime: conversation.lastMessage?.timestamp || null,
        lastMessageContent: lastMessage?.content || null,
        unreadMessageCount: await Message.countDocuments({
          conversationId: conversation._id,
          sender: { $ne: userId },
          status: { $ne: "read" },
        }),
        status: lastMessage?.status || "sent",
      };
    })
  );

  return JSON.parse(JSON.stringify(result));
};

// export const getConversations = async (
//   conversationId: string,
//   currentUserId: string
// ) => {
//   const conversation = await Conversation.findOne({ _id: conversationId })
//     .populate("participants", "username image")
//     .exec();

//   const targetUser = currentUserId
//     ? conversation.participants.find(
//         (u: any) => u._id.toString() !== currentUserId
//       )
//     : null;

//   const messages = await Message.find({ conversationId });

//   const filterMessages = messages.map((message) => {
//     return {
//       content: message.content,
//       isCurrentUser: message.sender.toString() === currentUserId,
//     };
//   });

//   const result = {
//     id: JSON.parse(JSON.stringify(targetUser._id)),
//     username: targetUser?.username,
//     profileImage: targetUser?.image || null,
//     messages: JSON.parse(JSON.stringify(filterMessages)),
//   };

//   return result;
// };

export const getOrCreateConversation = async (
  currentUserId: string,
  otherUserId: string
) => {
  let conversation = await Conversation.findOne({
    participants: { $all: [currentUserId, otherUserId] },
  }).populate("participants", "username image");

  if (!conversation) {
    conversation = new Conversation({
      participants: [currentUserId, otherUserId],
    });
    await conversation.save();
  }

  const filter = conversation.participants.filter((p: any) => {
    return p._id.toString() !== currentUserId;
  });
  return JSON.parse(JSON.stringify({ _id: conversation._id, user: filter[0] }));
};

export const saveNewMessage = async (
  conversationId: string,
  senderId: string,
  content: string
) => {
  const newMessage = new Message({ conversationId, sender: senderId, content });
  await Conversation.updateOne(
    { _id: conversationId },
    { lastMessage: newMessage._id },
    { new: true }
  );
  await newMessage.save();
};
