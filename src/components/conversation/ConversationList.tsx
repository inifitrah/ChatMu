"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  getConversations,
  getOrCreateConversation,
} from "@/app/actions/conversationActions";

import {
  useConversation,
  useConversationActions,
} from "@/contexts/ConversationContext";
import { useAppDispatch } from "@/hooks/use-dispatch-selector";
import { setOnlineUsers } from "@/redux-toolkit/features/users/userSlice";
import { useSocketContext } from "@/contexts/SocketContext";
import ConversationItem from "./ConversationItem";

const ConversationList = () => {
  const { data: session } = useSession();
  const { socket, listenOnlineUsers } = useSocketContext();
  const dispatch = useAppDispatch();
  const { conversations, query, searchConversations, status } =
    useConversation();

  const { setConversations, setSelectedConversation } =
    useConversationActions();

  // Check if the user is searching for conversations
  const showConversations = query ? searchConversations : conversations;

  useEffect(() => {
    if (session) {
      getConversations(session.user.id).then((data) => {
        const formattedData = data.map((conv) => {
          return {
            ...conv,
            message: conv.message
              ? {
                  ...conv.message,
                  lastMessageTime:
                    conv.message.lastMessageTime?.toString() ||
                    new Date().toString(),
                  status: conv.message.status,
                  unreadMessageCount: conv.message.unreadMessageCount || 0,
                }
              : undefined,
          };
        });
        setConversations(formattedData);
      });
    }
  }, [session]);

  useEffect(() => {
    // Listen to online users
    listenOnlineUsers((data) => {
      dispatch(setOnlineUsers(data));
    });

    return () => {
      if (socket) {
        socket.off("get_online_users");
      }
    };
  }, [socket]);

  const handleOpenChat = async (otherUserId: string) => {
    if (!session) return;
    await getOrCreateConversation(session?.user.id, otherUserId).then(
      (conv) => {
        // Mark conversation as read when opening
        // updateConversationStatus(conv._id, "read" as const);
        setSelectedConversation({
          conversationId: conv._id,
          userId: conv.user._id,
          username: conv.user.username,
          profileImage: conv.user.image,
        });
      }
    );
  };

  return (
    <>
      {(() => {
        switch (status) {
          case "failed":
            return (
              <div className="flex items-center justify-center w-full mt-5">
                <p className="text-destructive">User not found</p>
              </div>
            );
          case "loading":
            return (
              <div className="flex items-center justify-center w-full mt-5">
                <span className="w-12 h-12 rounded-full animate-spin border-t-accent-foreground border border-b-accent-foreground"></span>
              </div>
            );
          default:
            return showConversations.map((conv) => (
              <ConversationItem
                key={conv.conversationId}
                conv={conv}
                handleOpenChat={handleOpenChat}
              />
            ));
        }
      })()}
    </>
  );
};

export default ConversationList;
