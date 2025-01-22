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
    await getOrCreateConversation(session?.user.id, otherUserId).then(
      (conv) => {
        dispatch(
          setSelectedConversation({
            id: conv._id,
            userId: conv.user._id,
            username: conv.user.username,
            profileImage: conv.user.image,
          })
        );
      }
    );
  };

  return (
    <>
      {conversations.map((conv) => (
        <ConversationCard
          status={conv.status}
          onOpenChat={handleOpenChat}
          key={conv.otherUserId}
          otherUserId={conv.otherUserId}
          profileImage={conv.profileImage}
          username={conv.username}
          lastMessageTime={formatLastMessageTime(conv.lastMessageTime || "")}
          lastMessageContent={conv.lastMessageContent || ""}
          unreadMessageCount={conv.unreadMessageCount || 0}
        />
      ))}
    </>
  );
};

export default ConversationList;
