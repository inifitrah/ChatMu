"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getChatsDetails, getOrCreateChat } from "@/app/actions/chatActions";

import { setSelectedConversation } from "@/redux-toolkit/features/conversations/conversationSlice";
import ConversationListItems from "./ConversationListItems";
import { useAppDispatch } from "@/hooks/use-dispatch-selector";

const ConversationList = () => {
  const [chats, setChats] = useState([]);
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
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
