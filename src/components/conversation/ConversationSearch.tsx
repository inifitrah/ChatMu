import React, { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import ConversationCard from "@/components/conversation/ConversationCard";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { searchConversations } from "@/app/actions/conversationActions";
import { getOrCreateConversation } from "@/app/actions/conversationActions";
import { useSession } from "next-auth/react";

import { setSelectedConversation } from "@/redux-toolkit/features/conversations/conversationSlice";
import { useAppDispatch } from "@/hooks/use-dispatch-selector";

interface ConversationSearch {
  setIsCommandOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConversationSearch: React.FC<ConversationSearch> = ({
  setIsCommandOpen,
}) => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [searchResult, setSearchResult] = useState([]);
  const handleSearch = useDebounce((query: string) => {
    if (query.trim() === "") {
      setSearchResult([]);
      return;
    }
    searchConversations(query, session?.user.id).then((result) => {
      setSearchResult(result as any);
    });
  }, 800);

  const handleOpenChat = async (targetId: string) => {
    if (!session) return;
    await getOrCreateConversation(session?.user.id, targetId).then((chat) => {
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
            <ConversationCard
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

export default ConversationSearch;
