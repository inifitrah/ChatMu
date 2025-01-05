import React from "react";
import BackButton from "@/components/BackButton";
import ConversationProfile from "@/components/conversation/ConversationProfile";
import ConversationMenu from "@/components/conversation/ConversationMenu";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

interface ConversationHeaderProps {
  profileImage?: string;
  status?: string;
  username?: string;
  backButtonClick: () => void;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  profileImage,
  status,
  username,
  backButtonClick,
}) => {
  return (
    <header className="flex justify-between p-4 items-center text-black">
      <div className="flex gap-2 items-center ">
        <Button
          className="text-black"
          size={"box"}
          variant={"menu"}
          onClick={backButtonClick}
        >
          <ArrowLeft size={30} />
        </Button>
        <ConversationProfile src={profileImage} />
        <div>
          <h1 className="text-xl font-bold">{username}</h1>
          <p className="text-sm ">{status}</p>
        </div>
      </div>
      <ConversationMenu />
    </header>
  );
};

export default ConversationHeader;
