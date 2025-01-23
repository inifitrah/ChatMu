import { createSlice } from "@reduxjs/toolkit";
import { IConversation, ISelectedConversation } from "@/types/conversation";
interface InitialState {
  conversations: IConversation[];
  selectedConversation: ISelectedConversation;
}

const initialState: InitialState = {
  conversations: [],
  selectedConversation: {
    id: undefined,
    userId: undefined,
    username: undefined,
    profileImage: undefined,
  },
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
});

export const {
  setSelectedConversation,
  clearSelectedConversation,
  setConversations,
  setLastMessage,
  setConversationStatus,
} = conversationSlice.actions;

export default conversationSlice.reducer;
