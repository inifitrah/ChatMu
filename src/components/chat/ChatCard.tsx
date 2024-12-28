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
import ChatProfile from "./ChatProfile";
import { getOrCreateChat } from "@/app/actions/chatActions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ChatCardProps {
  profileImage?: string;
  username: string;
  lastMessageTime?: string;
  lastMessageContent?: string;
  unreadMessageCount?: number;
  targetId: string;
}

const ChatCard: React.FC<ChatCardProps> = ({
  targetId,
  profileImage,
  username,
  lastMessageTime,
  lastMessageContent,
  unreadMessageCount,
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleOpenChat = async () => {
    await getOrCreateChat(session?.user.id, targetId).then((chat) =>
      router.push(`/chat/${chat._id}`)
    );
  };

  return (
    <Card
      onClick={handleOpenChat}
      className="flex active:bg-slate-100 items-center ml-2 shadow-none border-none justify-center gap-2"
    >
      <ChatProfile src={profileImage} />
      <div className="flex flex-col basis-auto flex-grow border-t-gray-300 py-3 shadow-none border-t-2 min-w-0 w-full mr-2">
        <div className="flex items-center">
          <CardHeader className="flex-grow items-start m-0 p-0">
            <CardTitle className="text-lg">{username}</CardTitle>
          </CardHeader>
          <p className="text-violet-500 flex-none text-xs">{lastMessageTime}</p>
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
        </CardContent>
      </div>
    </Card>
  );
};

export default ChatCard;
