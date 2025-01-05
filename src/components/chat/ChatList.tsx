"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getChatsDetails, getOrCreateChat } from "@/app/actions/chatActions";
import { useRouter } from "next/navigation";
import ChatListItems from "./ChatListItems";

const ChatList = ({
  onSelectConversation,
}: {
  onSelectConversation: (id: string) => void;
}) => {
  const [chats, setChats] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();
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
      onSelectConversation(chat._id)
    );
  };

  return <ChatListItems chats={chats} onOpenChat={handleOpenChat} />;
};

export default ChatList;
