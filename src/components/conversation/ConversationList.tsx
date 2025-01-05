"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getChatsDetails, getOrCreateChat } from "@/app/actions/chatActions";

import { useDispatch } from "react-redux";
import { setSelectedConversation } from "@/redux-toolkit/features/conversations/conversationSlice";
import ConversationListItems from "./ConversationListItems";

const ConversationList = () => {
  const [chats, setChats] = useState([]);
  const { data: session } = useSession();
  const dispatch = useDispatch();
  useEffect(() => {
    if (session) {
      getChatsDetails(session?.user.id).then((chats) => {
        const filteredChats = chats.filter(
          (chat: any) => chat.lastMessageContent !== null
        );
        setChats(filteredChats);
      });
    }
  }, [session]);

  const handleOpenChat = async (targetId: string) => {
    if (!session) return;
    await getOrCreateChat(session?.user.id, targetId).then((chat) =>
      dispatch(setSelectedConversation({ id: chat._id }))
    );
  };

  return <ConversationListItems chats={chats} onOpenChat={handleOpenChat} />;
};

export default ConversationList;
