import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/hooks/use-dispatch-selector";
import { fetchSearchConversations } from "@/redux-toolkit/features/conversations/conversationThunks";

const ConversationSearch = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  const handleSearch = useDebounce((query) => {
    if (session) {
      dispatch(
        fetchSearchConversations({
          username: query,
          currentUserId: session.user.id,
        })
      );
    }
  }, 800);

  return (
    <Input
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search by username"
    />
  );
};

export default ConversationSearch;
