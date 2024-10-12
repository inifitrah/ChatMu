import React from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import ChatCard from "./ChatCard";

interface ChatSearchProps {
  setIsCommandOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatSearch: React.FC<ChatSearchProps> = ({ setIsCommandOpen }) => {
  return (
    <Command className={"absolute top-32 left-0 z-50 w-full"}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandItem>
          <ChatCard
            onClick={() => setIsCommandOpen(false)}
            key={1}
            isRead={false}
            number={10}
            uriProfile="/images/siprogrammer.jpg"
            message="woi"
            user="si programmer"
            date="kemarin"
          />
        </CommandItem>
      </CommandList>
    </Command>
  );
};

export default ChatSearch;
