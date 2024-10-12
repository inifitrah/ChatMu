import React, { useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import ChatCard from "./ChatCard";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "./ui/button";

interface ChatSearchProps {
  setIsCommandOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

import { chatData } from "@/constant.js";

const ChatSearch: React.FC<ChatSearchProps> = ({ setIsCommandOpen }) => {
  useEffect(() => {
    document.body.classList.add("body-no-scroll");
    return () => {
      document.body.classList.remove("body-no-scroll");
    };
  }, []);
  return (
    <Command className={"absolute rounded-none top-0 -left-1 z-50 "}>
      <div className="flex items-center px-2">
        <Button
          onClick={() => setIsCommandOpen(false)}
          className="text-popover-foreground p-0 active:bg-black/10 "
          variant={"menu"}
          size={"icon"}
        >
          <ArrowLeft size={27} className="" />
        </Button>
        <CommandInput placeholder="Type a command or search..." />
      </div>

      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {chatData.map((chat) => (
          <CommandItem key={chat.id}>
            <ChatCard
              onClick={() => setIsCommandOpen(false)}
              isRead={chat.isRead}
              number={chat.number}
              uriProfile={chat.uriProfile}
              message={chat.message}
              user={chat.user}
              date={chat.date}
            />
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
};

export default ChatSearch;
