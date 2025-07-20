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
import { useEffect, useRef } from "react";
import { useSocketContext } from "@/contexts/SocketContext";
import ConversationSearchResult from "@/components/conversation/ConversationSearchResult";
import useClickOutside from "@/hooks/useClickOutside";
import { ISelectedConversation } from "@/types/conversation";

function ConversationArea({
  resultsContainerRef,
}: {
  resultsContainerRef: React.RefObject<HTMLDivElement>;
}) {
  const {
    selectedConversation,
    isSearchLoading,
    isSearchActive,
    searchConversations,
    query,
  } = useConversation();

  const { setSelectedConversation, clearSearch, setIsSearchActive } =
    useConversationActions();

  return (
    <div className="relative flex flex-col">
      <ConversationList
        className={`absolute transition-all duration-300 ease-in-out ${
          isSearchActive
            ? "opacity-0 translate-y-7 pointer-events-none -rotate-x-10"
            : "opacity-100 translate-y-0 pointer-events-auto rotate-x-0"
        }`}
      />
      <ConversationSearchResult
        isLoading={isSearchLoading}
        resultContainerRef={resultsContainerRef}
        results={searchConversations}
        searchQuery={query}
        onItemClick={(item) => {
          if (item.type === "chat" || item.type === "user") {
            setIsSearchActive(false);
            const conversation: ISelectedConversation = {
              conversationId: item.id,
              userId: item.userId || "",
              username: item.title,
              profileImage: item.profileImage || "",
            };

            setSelectedConversation(conversation);
          }
        }}
        className={`absolute transition-all duration-300 ease-in-out ${
          isSearchActive
            ? "opacity-100 translate-y-0 pointer-events-auto rotate-x-0"
            : "opacity-0 -translate-y-2 pointer-events-none rotate-x-10"
        }`}
      />
      {selectedConversation && (
        <ConversationContainer conversation={selectedConversation} />
      )}
    </div>
  );
}

export default function Home() {
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const { listenMessageSent, listenMessageReceived, listenMessageRead } =
    useSocketContext();
  const { isSearchActive } = useConversation();
  const { updateConversationStatus, setIsSearchActive } =
    useConversationActions();
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

  useClickOutside([searchContainerRef, resultsContainerRef], () => {
    if (isSearchActive) {
      setIsSearchActive(false);
    }
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
      <Header searchContainerRef={searchContainerRef} />
      <main className="bg-background">
        <ConversationArea resultsContainerRef={resultsContainerRef} />
      </main>
    </div>
  );
}
