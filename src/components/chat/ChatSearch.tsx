import React, { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import ChatCard from "@/components/chat/ChatCard";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { searchChats } from "@/app/actions/chatActions";

interface ChatSearchProps {
  setIsCommandOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatSearch: React.FC<ChatSearchProps> = ({ setIsCommandOpen }) => {
  const [searchResult, setSearchResult] = useState([]);
  const handleSearch = useDebounce((query: string) => {
    if (query.trim() === "") {
      setSearchResult([]);
      return;
    }
    searchChats(query).then((result) => {
      setSearchResult(result as any);
    });
  }, 800);

  return (
    <Command className={"absolute rounded-none top-0 -left-1 z-50 "}>
      <div className="flex items-center px-2">
        <Button
          onClick={() => setIsCommandOpen(false)}
          className="text-popover-foreground p-0 active:bg-black/10 "
          variant={"menu"}
          size={"box"}
        >
          <ArrowLeft size={27} className="" />
        </Button>
        <CommandInput
          onValueChange={handleSearch}
          placeholder="Search by username"
        />
      </div>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {searchResult.map((chat: any) => (
          <CommandItem key={chat._id} value={chat.username}>
            <ChatCard
              profileImage={chat.image}
              username={chat.username}
              lastMessageTime={chat.lastMessageTime || ""}
              lastMessageContent={chat.lastMessageContent || ""}
              unreadMessageCount={chat.unreadMessageCount || 0}
            />
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
};

export default ChatSearch;
