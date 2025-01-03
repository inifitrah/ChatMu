"use client";
import React, { useEffect, useState } from "react";
import ChatCard from "./ChatCard";
import { useSession } from "next-auth/react";
import { getChatsDetails, getOrCreateChat } from "@/app/actions/chatActions";
import { formatLastMessageTime } from "@/utils/formatLastMessageTime";
import { useRouter } from "next/navigation";

interface IChat {
  targetId: string;
  profileImage: string;
  username: string;
  lastMessageTime: Date;
  lastMessageContent: string;
  unreadMessageCount: number;
}

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session) {
      getChatsDetails(session?.user.id).then((chats) => {
        setChats(chats);
      });
    }
  }, [session]);

  const handleOpenChat = async (targetId: string) => {
    if (!session) return;
    await getOrCreateChat(session?.user.id, targetId).then((chat) =>
      router.push(`/chat/${chat._id}`)
    );
  };

  return (
    <>
      {chats.length > 0 ? (
        chats.map((chat: IChat, index) => (
          <ChatCard
            onOpenChat={handleOpenChat}
            key={index}
            targetId={chat.targetId}
            profileImage={chat.profileImage}
            username={chat.username}
            lastMessageTime={formatLastMessageTime(chat.lastMessageTime)}
            lastMessageContent={chat.lastMessageContent || ""}
            unreadMessageCount={chat.unreadMessageCount || 0}
          />
        ))
      ) : (
        <p className="text-center">No chats</p>
      )}
    </>
  );
};

export default ChatList;
