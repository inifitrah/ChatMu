import React from "react";
import ConversationCard from "./ConversationCard";
import { useAppSelector } from "@/hooks/use-dispatch-selector";
import { formatLastMessageTime } from "@/utils/formatLastMessageTime";
import { IMessage } from "@/types/conversation";

type MessageStatus = IMessage["status"];
interface ConversationItemProps {
  conv: {
    otherUserId: string;
    profileImage?: string;
    username: string;
    message?: {
      isCurrentUser?: boolean;
      lastMessageTime?: Date;
      lastMessageContent?: string;
      unreadMessageCount?: number;
      status?: MessageStatus;
    };
  };
  handleOpenChat: (otherUserId: string) => void;
}

const ConversationItem = ({ conv, handleOpenChat }: ConversationItemProps) => {
  const onlineUsers = useAppSelector((state) => state.user.onlineUsers);
  const onlineUser = onlineUsers.find((user) => {
    return user.userId === conv.otherUserId;
  });
  return (
    <ConversationCard
      key={conv.otherUserId}
      onOpenChat={handleOpenChat}
      otherUserId={conv.otherUserId}
      profileImage={conv.profileImage}
      username={conv.username}
      lastMessageIsCurrentUser={conv.message?.isCurrentUser}
      lastMessageTime={conv.message?.lastMessageTime}
      lastMessageContent={conv.message?.lastMessageContent || ""}
      unreadMessageCount={conv?.message?.unreadMessageCount || 0}
      status={conv?.message?.status || "sent"}
      isOnline={onlineUser ? true : false}
    />
  );
};

export default ConversationItem;
