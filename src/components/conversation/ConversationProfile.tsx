import React from "react";
import { CircleUser } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ConversationProfile = ({ src }: { src?: string }) => {
  return (
    <Avatar className="border-2 cursor-pointer mx-1">
      <AvatarImage src={src} />
      <AvatarFallback className="cursor-pointer">
        <CircleUser size={60} />
      </AvatarFallback>
    </Avatar>
  );
};

export default ConversationProfile;
