import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/hooks/use-dispatch-selector";
import { fetchSearchConversations } from "@/redux-toolkit/features/conversations/conversationThunks";
import { X } from "lucide-react";
import { clearSearch } from "@/redux-toolkit/features/conversations/conversationSlice";

const ConversationSearch = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const [inputValue, setInputValue] = useState("");

  const handleSearch = useCallback(
    useDebounce((query) => {
      query = query.trim(); // Remove leading and trailing spaces

      if (session && query.trim()) {
        dispatch(
          fetchSearchConversations({
            username: query,
            currentUserId: session.user.id,
          })
        );
      } else {
        dispatch(clearSearch());
      }
    }, 888),
    [dispatch, session]
  );

  const handleClear = () => {
    setInputValue("");
    dispatch(clearSearch());
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
        className="flex-grow"
      />
      {inputValue && (
        <span
          onClick={handleClear}
          className="absolute active:bg-destructive/50 rounded-full border-border border cursor-pointer right-4"
        >
          <X />
        </span>
      )}
    </div>
  );
};

export default ConversationSearch;
