import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircleUser } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ChatCardProps {
  profileImage: string;
  username: string;
  lastMessageTime: string;
  lastMessageContent: string;
  unreadMessageCount: number;
}

const ChatCard: React.FC<ChatCardProps> = ({
  profileImage,
  username,
  lastMessageTime,
  lastMessageContent,
  unreadMessageCount,
}) => {
  return (
    <Card className="flex active:bg-slate-100 items-center ml-2 shadow-none border-none justify-center gap-2">
      <Avatar className="border-2 cursor-pointer mx-1">
        <AvatarImage src={profileImage} />
        <AvatarFallback className="cursor-pointer">
          <CircleUser size={60} />
        </AvatarFallback>
      </Avatar>
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
            style={{ opacity: unreadMessageCount === 0 ? "0" : "1" }}
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
