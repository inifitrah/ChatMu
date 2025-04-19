import { createSlice } from "@reduxjs/toolkit";
import { IConversation, ISelectedConversation } from "@/types/conversation";
import { fetchSearchConversations } from "./conversationThunks";
interface InitialState {
  conversations: IConversation[];
  selectedConversation: ISelectedConversation;
  searchConversations: IConversation[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: InitialState = {
  conversations: [],
  selectedConversation: {
    id: undefined,
    userId: undefined,
    username: undefined,
    profileImage: undefined,
  },
  searchConversations: [],
  status: "idle",
};
const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversations(state, action) {
      state.conversations = action.payload;
    },
    setConversationStatus(state, action) {
      const { conversationId, status } = action.payload;
      const conversationIndex = state.conversations.findIndex(
        (conversation) => conversation.id === conversationId
      );
      state.conversations[conversationIndex].message.status = status;
    },
    setLastMessage(state, action) {
      const { conversationId, lastMessageContent, lastMessageTime } =
        action.payload;
      const conversationIndex = state.conversations.findIndex(
        (conversation) => conversation.id === conversationId
      );
      state.conversations[conversationIndex].message.lastMessageContent =
        lastMessageContent;
      state.conversations[conversationIndex].message.lastMessageTime =
        lastMessageTime;
    },
    setSelectedConversation(state, action) {
      state.selectedConversation = action.payload;
    },
    clearSelectedConversation(state) {
      state.selectedConversation = initialState.selectedConversation;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchConversations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSearchConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchConversations = action.payload;
      })
      .addCase(fetchSearchConversations.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const {
  setSelectedConversation,
  clearSelectedConversation,
  setConversations,
  setLastMessage,
  setConversationStatus,
} = conversationSlice.actions;

export default conversationSlice.reducer;
