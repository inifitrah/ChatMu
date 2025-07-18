import React, { useCallback, useEffect, useState, RefObject } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import {
  useConversation,
  useConversationActions,
} from "@/contexts/ConversationContext";

interface ConversationSearchProps {
  searchContainerRef: RefObject<HTMLDivElement>;
}

const ConversationSearch = ({
  searchContainerRef,
}: ConversationSearchProps) => {
  const { data: session } = useSession();
  const [inputValue, setInputValue] = useState("");
  const { isSearchActive } = useConversation();
  const { setSearchQuery, setIsSearchLoading, clearSearch, setIsSearchActive } =
    useConversationActions();

  const handleSearch = useCallback(
    useDebounce((query: string) => {
      query = query.trim(); // Remove leading and trailing spaces

      if (session && query.trim()) {
        setIsSearchLoading(true);
        setSearchQuery(query);
      } else {
        clearSearch();
      }
    }, 888),
    [session]
  );

  const handleSearchFocus = () => {
    setIsSearchActive(true);
  };

  const handleSearchClear = () => {
    setInputValue("");
    clearSearch();
    setIsSearchActive(false);
  };

  useEffect(() => {
    handleSearch(inputValue);
  }, [inputValue]);

  return (
    <div ref={searchContainerRef} className="relative flex items-center">
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search"
        onFocus={handleSearchFocus}
        className="flex-grow"
      />
      {isSearchActive && (
        <span
          onClick={handleSearchClear}
          className="absolute active:bg-destructive/50 rounded-full border-border border cursor-pointer right-4"
        >
          <X />
        </span>
      )}
    </div>
  );
};

export default ConversationSearch;
