"use client";
import Header from "@/components/header/Header";
import ConversationList from "@/components/conversation/ConversationList";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import ConversationContainer from "@/components/conversation/ConversationContainer";
import {
  useConversation,
  useConversationActions,
} from "@/contexts/ConversationContext";
import useIncomingMessage from "@/hooks/useIncomingMessage";
import { useEffect } from "react";
import { useSocketContext } from "@/contexts/SocketContext";
import ConversationSearchResult from "@/components/conversation/ConversationSearchResult";

function ConversationArea() {
  const { selectedConversation, isSearchActive } = useConversation();
  return (
    <div className="relative flex flex-col">
      <ConversationList
        className={`absolute z-30 transition-all duration-300 ease-in-out ${
          isSearchActive
            ? "opacity-0 translate-y-7 -rotate-x-10"
            : "opacity-100 translate-y-0 rotate-x-0"
        }`}
      />
      <ConversationSearchResult
        className={`absolute z-20 transition-all duration-300 ease-in-out ${
          isSearchActive
            ? "opacity-100 translate-y-0 rotate-x-0"
            : "opacity-0 -translate-y-2 rotate-x-10"
        }`}
      />
      {selectedConversation && (
        <ConversationContainer conversation={selectedConversation} />
      )}
    </div>
  );
}

export default function Home() {
  const { listenMessageSent, listenMessageReceived, listenMessageRead } =
    useSocketContext();
  const { updateConversationStatus } = useConversationActions();
  const { toast } = useToast();
  useSession({
    required: true,
    onUnauthenticated() {
      toast({
        description: "Logged Out",
      });
      redirect("/auth");
    },
  });

  useIncomingMessage();

  useEffect(() => {
    const listener = listenMessageSent((data) => {
      updateConversationStatus(data.conversationId, "sent");
    });

    return () => listener.off();
  }, [listenMessageSent]);

  useEffect(() => {
    const listener = listenMessageReceived((data) => {
      updateConversationStatus(data.conversationId, "delivered");
    });

    return () => listener.off();
  }, [listenMessageReceived]);

  useEffect(() => {
    const listener = listenMessageRead((conversationId: string) => {
      updateConversationStatus(conversationId, "read");
    });
    return () => listener.off();
  }, [listenMessageRead]);

  return (
    <div className="wrapper-page">
      <Header />
      <main className="bg-background">
        <ConversationArea />
      </main>
    </div>
  );
}
