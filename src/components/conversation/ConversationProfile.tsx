import React from "react";
import { CircleUser } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ConversationProfile = ({
  src,
  isOnline,
}: {
  src?: string;
  isOnline?: boolean;
}) => {
  return (
    <div className="relative">
      <Avatar className="border-2 cursor-pointer mx-1">
        <AvatarImage src={src} />
        <AvatarFallback className="cursor-pointer">
          <CircleUser size={60} />
        </AvatarFallback>
      </Avatar>
      {isOnline && (
        <span className="absolute bottom-1 right-1 block h-3 w-3 rounded-full ring-2 ring-white bg-green-400"></span>
      )}
    </div>
  );
};

export default ConversationProfile;
