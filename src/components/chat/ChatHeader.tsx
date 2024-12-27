import React from "react";
import BackButton from "@/components/BackButton";
import ChatProfile from "@/components/chat/ChatProfile";
import ChatMenu from "@/components/chat/ChatMenu";

interface ChatHeaderProps {
  profileImage?: string;
  status?: string;
  username?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  profileImage,
  status,
  username,
}) => {
  return (
    <header className="flex justify-between p-4 items-center text-black">
      <div className="flex gap-2 items-center ">
        <BackButton href="/" />
        <ChatProfile src={profileImage} />
        <div>
          <h1 className="text-xl font-bold">{username}</h1>
          <p className="text-sm ">{status}</p>
        </div>
      </div>
      <ChatMenu />
    </header>
  );
};

export default ChatHeader;
