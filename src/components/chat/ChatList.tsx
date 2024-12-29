"use client";
import React, { useEffect, useState } from "react";
import ChatCard from "./ChatCard";
import { useSession } from "next-auth/react";
import { getChatsDetails } from "@/app/actions/chatActions";
import { useSocketContext } from "@/contexts/SocketContext";

interface Message {
  text?: string;
  isCurrentUser?: boolean;
}

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      getChatsDetails(session?.user.id).then((chats) => {
        setChats(chats);
      });
    }
  }, [session]);

  return (
    <>
      {chats.length > 0 ? (
        chats.map((chat, index) => (
          <ChatCard
            key={index}
            targetId={chat.targetId}
            profileImage={chat.profileImage}
            username={chat.username}
            lastMessageTime={chat.lastMessageTime || ""}
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
