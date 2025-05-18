"use client";
import Header from "@/components/header/Header";
import ConversationList from "@/components/conversation/ConversationList";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useSocketContext } from "@/contexts/SocketContext";
import ConversationContainer from "@/components/conversation/ConversationContainer";
import { useAppDispatch, useAppSelector } from "@/hooks/use-dispatch-selector";
import { useEffect } from "react";
import {
  setLastMessage,
  setMessage,
} from "@/redux-toolkit/features/conversations/conversationSlice";

export default function Home() {
  const { socket, connected, listenMessage } = useSocketContext();
  const selectedConversation = useAppSelector(
    (state) => state.conversation.selectedConversation
  );
  const conversation = useAppSelector(
    (state) => state.conversation.conversations
  );
  const dispatch = useAppDispatch();
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

  useEffect(() => {
    if (socket && conversation.length) {
      listenMessage((data) => {
        const { conversationId, content, sender, recipient } = data;

        dispatch(
          setMessage({
            conversationId: conversationId,
            sender: {
              id: sender.id,
              username: sender.username,
            },
            recipient: {
              id: recipient.id,
              username: recipient.username,
            },
            content: content,
            type: "text",
            status: "sent",
          })
        );
        dispatch(
          setLastMessage({
            lastMessageIsCurrentUser: sender.id === session?.user.id,
            conversationId: conversationId,
            lastMessageContent: content,
            lastMessageTime: new Date().toString(),
          })
        );
        toast({
          title: sender.username,
          description: content,
        });
      });
    }
  }, [listenMessage, conversation]);

  return (
    <div className="wrapper-page">
      <Header />
      <main className="bg-background">
        <ConversationList />
        {selectedConversation && (
          <ConversationContainer conversation={selectedConversation} />
        )}
      </main>
    </div>
  );
}
