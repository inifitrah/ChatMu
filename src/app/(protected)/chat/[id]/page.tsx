"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getConversation, saveNewMessage } from "@/app/actions/chatActions";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useSocketContext } from "@/contexts/SocketContext";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
interface Message {
  content: string;
  type: "text" | "server";
  isCurrentUser: boolean;
}

interface IReceiveMessage {
  chatId: string;
  sender: { id: string; username: string };
  recipient: { id: string; username: string };
  content: string;
  type: string;
}

interface IConversation {
  id: "string";
  username: string;
  profileImage?: string;
  messages?: Message[];
}

const Page = () => {
  const { socket, isConnected } = useSocketContext();
  const { data: session } = useSession();
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<IConversation>();
  const { toast } = useToast();

  const handleSendMessage = (newMessage: string) => {
    setMessages([
      ...messages,
      { content: newMessage, isCurrentUser: true, type: "text" },
    ]);
    socket?.emit("message", {
      chatId: id,
      sender: {
        id: session?.user.id,
        username: session?.user.username,
      },
      recipient: {
        id: conversation?.id,
        username: conversation?.username,
      },
      content: newMessage,
      type: "text",
    });
    saveNewMessage(id, session?.user.id, newMessage);
  };
  const fetchConversation = useCallback(async () => {
    if (id && session?.user.id) {
      const conversation = await getConversation(id, session?.user.id);
      setMessages([...conversation.messages]);
      setConversation(conversation);
    }
  }, [id, session]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  useEffect(() => {
    if (isConnected) {
      socket?.on("receiveMessage", (receiveMessage: IReceiveMessage) => {
        const { content, type } = receiveMessage;
        setMessages([
          ...messages,
          {
            content,
            isCurrentUser: false,
            type: type as "text",
          },
        ]);
      });
    }
  }, [messages, socket, isConnected, session]);

  return (
    <>
      <ChatHeader
        username={conversation?.username}
        profileImage={conversation?.profileImage}
        status="Online"
      />
      <ChatWindow messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </>
  );
};
export default Page;
