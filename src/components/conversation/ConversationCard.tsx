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
import { Check, CheckCheck } from "lucide-react";

interface ConversationCardProps {
  profileImage?: string;
  username: string;
  lastMessageTime: string;
  lastMessageContent?: string;
  unreadMessageCount?: number;
  lastMessageIsCurrentUser: boolean;
  otherUserId: string;
  status: "sent" | "delivered" | "read";
  onOpenChat: (otherUserId: string) => void;
  isOnline?: boolean;
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
      className="flex active:bg-slate-100 items-center ml-2 shadow-none border-none justify-center gap-2"
    >
      <ConversationProfile isOnline={isOnline} src={profileImage} />
      <div className="flex flex-col basis-auto flex-grow border-t-gray-300 py-3 shadow-none border-t-2 min-w-0 w-full mr-2">
        <div className="flex items-center">
          <CardHeader className="flex-grow items-start m-0 p-0">
            <CardTitle className="text-lg">{username}</CardTitle>
          </CardHeader>
          {lastMessageContent && (
            <p className="text-violet-500 flex-none text-xs">
              {lastMessageTime}
            </p>
          )}
        </div>
        <CardContent className="flex mt-1 overflow-hidden items-center p-0">
          <CardDescription className="flex-grow overflow-hidden max-h-5">
            {lastMessageContent}
          </CardDescription>
          <Badge
            style={{
              opacity:
                unreadMessageCount === undefined || unreadMessageCount === 0
                  ? "0"
                  : "1",
            }}
            className="bg-violet-500 text-white ml-1 flex justify-center items-center"
            variant="outline"
          >
            {unreadMessageCount}
          </Badge>

          {lastMessageIsCurrentUser && (
            <>
              {status === "sent" && <Check />}
              {status === "delivered" && <CheckCheck />}
              {status === "read" && <CheckCheck className="text-violet-500" />}
            </>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default ConversationCard;
