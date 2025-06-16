import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import { useConversationActions } from "@/contexts/ConversationContext";

const ConversationSearch = () => {
  const { setIsSearchActive } = useConversationActions();
  const { data: session } = useSession();
  const [inputValue, setInputValue] = useState("");
  const { setSearchQuery, clearSearch } = useConversationActions();

  const handleSearch = useCallback(
    useDebounce((query: string) => {
      query = query.trim(); // Remove leading and trailing spaces

      if (session && query.trim()) {
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

  const handleSearchBlur = () => {
    if (!inputValue) {
      setIsSearchActive(false);
    }
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
    <div className="relative flex items-center">
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search by username"
        onBlur={handleSearchBlur}
        onFocus={handleSearchFocus}
        className="flex-grow"
      />
      {inputValue && (
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
