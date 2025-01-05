"use client";
import Header from "@/components/header/Header";
import ChatList from "@/components/chat/ChatList";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useSocketContext } from "@/contexts/SocketContext";
import { useEffect, useState } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import ChatContainer from "@/components/chat/ChatContainer";

export default function Home() {
  const { socket, isConnected, isOnline } = useSocketContext();
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const { toast } = useToast();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      toast({
        description: "Logged Out",
      });
      redirect("/auth");
    },
  });

  const handleOnSelectConversation = (id: string) => {
    setSelectedConversationId(id);
  };

  return (
    <>
      <Header />
      <main className="">
        <p>Socket: {isConnected ? "Connected" : "Disconnected"}</p>
        <ChatList onSelectConversation={handleOnSelectConversation} />
        {selectedConversationId && (
          <ChatContainer
            setSelectedConversationId={setSelectedConversationId}
            selectedConversationId={selectedConversationId}
          />
        )}
      </main>
    </>
  );
}
