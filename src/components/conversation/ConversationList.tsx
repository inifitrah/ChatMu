"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  getConversations,
  getOrCreateConversation,
} from "@/app/actions/conversationActions";

import {
  setConversations,
  setSelectedConversation,
} from "@/redux-toolkit/features/conversations/conversationSlice";
import { setOnlineUsers } from "@/redux-toolkit/features/users/userSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/use-dispatch-selector";
import ConversationCard from "@/components/conversation/ConversationCard";
import { formatLastMessageTime } from "@/utils/formatLastMessageTime";
import { useSocketContext } from "@/contexts/SocketContext";

const ConversationList = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const { socket, listenOnlineUsers } = useSocketContext();
  const onlineUsers = useAppSelector((state) => state.user.onlineUsers);
  const conversations = useAppSelector(
    (state) => state.conversation.conversations
  );
  useEffect(() => {
    if (session) {
      getConversations(session?.user.id).then((data) => {
        dispatch(setConversations(data));
      });
    }
  }, [session]);

  useEffect(() => {
    // Listen to online users
    listenOnlineUsers((data) => {
      dispatch(setOnlineUsers(data));
      console.log("state-redux", onlineUsers);
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
        dispatch(
          setSelectedConversation({
            id: conv._id,
            userId: conv.user._id,
            username: conv.user.username,
            profileImage: conv.user.image,
          })
        );
      }
    );
  };

  return (
    <>
      {conversations.map((conv) => {
        // handle online status
        const onlineUser = onlineUsers.find((user) => {
          console.log("user", user);
          return user.userId === conv.otherUserId;
        });
        return (
          <ConversationCard
            onOpenChat={handleOpenChat}
            key={conv.otherUserId}
            otherUserId={conv.otherUserId}
            profileImage={conv.profileImage}
            username={conv.username}
            lastMessageIsCurrentUser={conv.message.isCurrentUser}
            lastMessageTime={formatLastMessageTime(
              conv.message.lastMessageTime || ""
            )}
            lastMessageContent={conv.message.lastMessageContent || ""}
            unreadMessageCount={conv.message.unreadMessageCount || 0}
            status={conv.message.status}
            isOnline={onlineUser ? true : false}
          />
        );
      })}
    </>
  );
};

export default ConversationList;
