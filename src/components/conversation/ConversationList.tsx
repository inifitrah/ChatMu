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
import ConversationListItems from "./ConversationListItems";
import { useAppDispatch, useAppSelector } from "@/hooks/use-dispatch-selector";

const ConversationList = () => {
  const [chats, setChats] = useState([]);
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
  }, [session, dispatch]);

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
    <ConversationListItems
      conversations={conversations}
      onOpenChat={handleOpenChat}
    />
  );
};

export default ConversationList;
