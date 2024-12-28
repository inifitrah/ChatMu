"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getConversation, sendNewMessage } from "@/app/actions/chatActions";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useSocketContext } from "@/contexts/SocketContext";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
interface Message {
  text: string;
  isCurrentUser: boolean;
}

interface IConversation {
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
    setMessages([...messages, { text: newMessage, isCurrentUser: true }]);
    sendNewMessage(id, session?.user.id, newMessage);
    socket?.emit("message", {
      from: session?.user.username,
      to: conversation?.username,
      text: newMessage,
    });
  };
  const fetchConversation = useCallback(async () => {
    if (id && session?.user.id) {
      console.log("fetching conversation");
      const conversation = await getConversation(id, session?.user.id);
      setMessages([...conversation.messages]);
      setConversation(conversation);
    }
  }, [id, session]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  useEffect(() => {
    if (!isConnected) {
      socket?.connect();
    }

    if (isConnected) {
      socket?.on(
        "receiveMessage",
        (receiveMessage: { from: string; text: string }) => {
          setMessages([
            ...messages,
            { text: receiveMessage.text, isCurrentUser: false },
          ]);
        }
      );
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
