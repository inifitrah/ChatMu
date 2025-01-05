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
import { getOrCreateChat } from "@/app/actions/chatActions";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setSelectedConversation } from "@/redux-toolkit/features/conversations/conversationSlice";

interface ChatSearchProps {
  setIsCommandOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatSearch: React.FC<ChatSearchProps> = ({ setIsCommandOpen }) => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const [searchResult, setSearchResult] = useState([]);
  const handleSearch = useDebounce((query: string) => {
    if (query.trim() === "") {
      setSearchResult([]);
      return;
    }
    searchChats(query, session?.user.id).then((result) => {
      setSearchResult(result as any);
    });
  }, 800);

  const handleOpenChat = async (targetId: string) => {
    if (!session) return;
    await getOrCreateChat(session?.user.id, targetId).then((chat) => {
      dispatch(
        setSelectedConversation({
          id: chat._id,
        })
      );
    });
  };

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
        {searchResult.map((target: any, index) => (
          <CommandItem key={index} value={target.username}>
            <ChatCard
              targetId={target.targetId}
              onOpenChat={handleOpenChat}
              profileImage={target.profileImage}
              username={target.username}
              lastMessageTime={target.lastMessageTime || ""}
              lastMessageContent={target.lastMessageContent || ""}
              unreadMessageCount={target.unreadMessageCount || 0}
            />
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
};

export default ChatSearch;
