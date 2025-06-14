"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import ConversationProfile from "./ConversationProfile";
import { ClockArrowUp, Check, CheckCheck, Loader } from "lucide-react";

interface ConversationCardProps {
  profileImage?: string;
  username: string;
  lastMessageTime?: string;
  lastMessageContent?: string;
  unreadMessageCount?: number;
  lastMessageIsCurrentUser?: boolean;
  otherUserId: string;
  status?: "sending" | "sent" | "delivered" | "read" | "failed";
  onOpenChat: (otherUserId: string) => void;
  isOnline: boolean;
}

const ConversationCard: React.FC<ConversationCardProps> = ({
  profileImage,
  username,
  lastMessageTime,
  lastMessageContent,
  lastMessageIsCurrentUser,
  unreadMessageCount,
  otherUserId,
  status,
  isOnline,
  onOpenChat,
}) => {
  return (
    <Card
      onClick={() => onOpenChat(otherUserId)}
      className="flex pl-7 bg-inherit hover:bg-card items-center shadow-none border-none justify-center gap-2 group"
    >
      <ConversationProfile isOnline={isOnline} src={profileImage} />
      <div
        className="flex flex-col basis-auto flex-grow py-5 pr-7 shadow-none min-w-0 w-full mr-2
      border-t [.group:first-child_&]:border-t-0
      "
      >
        <div className="flex items-center">
          <CardHeader className="flex-grow items-start m-0 p-0">
            <CardTitle className="text-lg font-bold leading-none">
              {username}
            </CardTitle>
          </CardHeader>
          {lastMessageContent && (
            <p className="text-foreground flex-none text-sm">
              {lastMessageTime}
            </p>
          )}
        </div>
        <CardContent className="flex overflow-hidden items-center p-0">
          <CardDescription className="flex-grow overflow-hidden text-sm max-h-5">
            {lastMessageContent}
          </CardDescription>

          <Badge
            style={{
              opacity: unreadMessageCount && unreadMessageCount > 0 ? "1" : "0",
            }}
            className="bg-violet-500 text-white ml-1 flex justify-center items-center"
            variant="outline"
          >
            {unreadMessageCount}
          </Badge>
          {lastMessageIsCurrentUser && (
            <>
              {status === "sending" && <Loader />}
              {status === "sent" && <Check />}
              {status === "delivered" && <CheckCheck />}
              {status === "read" && <CheckCheck className="text-sky-600" />}
            </>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default ConversationCard;
