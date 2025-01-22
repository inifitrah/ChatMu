"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  getConversations,
  getOrCreateConversation,
} from "@/app/actions/conversationActions";

import {
  setConversations,
  setSelectedConversation,
} from "@/redux-toolkit/features/conversations/conversationSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/use-dispatch-selector";
import ConversationCard from "@/components/conversation/ConversationCard";
import { formatLastMessageTime } from "@/utils/formatLastMessageTime";

interface IConversation {
  otherUserId: string;
  profileImage: string;
  username: string;
  lastMessageTime: Date;
  lastMessageContent: string;
  unreadMessageCount: number;
  status: "sent" | "delivered" | "read";
}

const ConversationList = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const conversations = useAppSelector(
    (state) => state.conversation.conversations
  );
  useEffect(() => {
    if (session) {
      getConversations(session?.user.id).then((data) => {
        dispatch(setConversations(data));
      });
    }
  }, [session]);

  const handleOpenChat = async (otherUserId: string) => {
    if (!session) return;
    await getOrCreateConversation(session?.user.id, otherUserId).then((c) => {
      dispatch(
        setSelectedConversation({
          id: c._id,
          userId: c.user._id,
          username: c.user.username,
          profileImage: c.user.image,
        })
      );
    });
  };

  return (
    <>
      {conversations.map((c: IConversation) => (
        <ConversationCard
          status={c.status}
          onOpenChat={handleOpenChat}
          key={c.otherUserId}
          otherUserId={c.otherUserId}
          profileImage={c.profileImage}
          username={c.username}
          lastMessageTime={formatLastMessageTime(c.lastMessageTime || "")}
          lastMessageContent={c.lastMessageContent || ""}
          unreadMessageCount={c.unreadMessageCount || 0}
        />
      ))}
    </>
  );
};

export default ConversationList;
