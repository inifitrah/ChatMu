import React, { useEffect } from "react";
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

interface User {
  _id: string;
  username: string;
  image: string;
  isOnline: boolean;
}

interface LastMessage {
  content: string | null;
}

interface Conversation {
  _id: string;
  participants: User[];
  lastMessage: LastMessage | null;
}

interface ChatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  conversation: Conversation;
}

const ChatCard: React.FC<ChatCardProps> = ({ conversation, ...props }) => {
  useEffect(() => {
    // console.log(conversation);
  }, []);

  const { participants, lastMessage } = conversation;

  const filteredParticipants = participants.filter(
    (participant) => participant._id !== "6718e1bac9b7c37002817409"
  );
  const { username, image } = filteredParticipants[0];
  const content = lastMessage ? lastMessage.content : null;
  return (
    <Card
      {...props}
      className="flex active:bg-slate-100 items-center ml-2 shadow-none border-none justify-center gap-2"
    >
      <Avatar className="border-2 cursor-pointer mx-1">
        <AvatarImage src={image} />
        <AvatarFallback className="cursor-pointer">
          <CircleUser size={60} />
        </AvatarFallback>
      </Avatar>
      <div className="flex  flex-col basis-auto flex-grow border-t-gray-300 py-3 shadow-none border-t-2  min-w-0 w-full mr-2  ">
        <div className="flex items-center ">
          <CardHeader className="flex-grow items-start m-0 p-0 ">
            <CardTitle className="text-lg">{username}</CardTitle>
          </CardHeader>
          {content && (
            <p className="text-violet-500 flex-none text-xs">{"kemarin"}</p>
          )}
        </div>
        <CardContent className="flex mt-1 overflow-hidden items-center  p-0">
          <CardDescription className="flex-grow overflow-hidden max-h-5 ">
            {content}
          </CardDescription>
          <Badge
            style={{ opacity: !content && "0" }}
            className="bg-violet-500 text-white ml-1 flex justify-center items-center"
            variant="outline"
          >
            {1}
          </Badge>
        </CardContent>
      </div>
    </Card>
  );
};

export default ChatCard;
