"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getConversation } from "@/app/actions/chatActions";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useSocketContext } from "@/contexts/SocketContext";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
interface Message {
  message: string;
  isCurrentUser: boolean;
}

interface IConversation {
  username: string;
  image?: string;
}

const Page = () => {
  const { socket, isConnected } = useSocketContext();
  const { data: session } = useSession();
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<IConversation>();
  const { toast } = useToast();

  const handleSendMessage = (newMessage: string) => {
    setMessages([...messages, { message: newMessage, isCurrentUser: true }]);
    socket?.emit("message", {
      from: session?.user.username,
      to: conversation?.username,
      text: newMessage,
    });
  };

  const fetchConversation = useCallback(async () => {
    if (id) {
      const conversation = await getConversation(id);
      setConversation(conversation);
    }
  }, [id]);

  useEffect(() => {
    fetchConversation();

    if (!isConnected) {
      socket?.connect();
    }

    if (isConnected) {
      socket?.on(
        "receiveMessage",
        (receiveMessage: { from: string; text: string }) => {
          setMessages([
            ...messages,
            { message: receiveMessage.text, isCurrentUser: false },
          ]);
        }
      );
    }
  }, [messages, socket, isConnected]);

  return (
    <>
      <ChatHeader
        username={conversation?.username}
        profileImage={conversation?.image}
        status="Online"
      />
      <ChatWindow messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </>
  );
};
export default Page;
