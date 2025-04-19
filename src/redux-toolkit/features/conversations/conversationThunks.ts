import { searchConversations } from "@/app/actions/conversationActions";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchSearchConversations = createAsyncThunk(
  "conversations/searchConversations",
  async ({
    username,
    currentUserId,
  }: {
    username: string;
    currentUserId: string;
  }) => {
    const result = await searchConversations(username, currentUserId);
    return result;
  }
);

export { fetchSearchConversations };
