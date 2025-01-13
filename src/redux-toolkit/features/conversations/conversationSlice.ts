import { createSlice } from "@reduxjs/toolkit";

interface Conversation {
  id: string;
  otherUserId: string;
  profileImage: string;
  username: string;
  lastMessageTime: Date;
  lastMessageContent: string;
  unreadMessageCount: number;
  status: "sent" | "delivered" | "read";
}

interface SelectedConversation {
  id: string | undefined;
  userId: string | undefined;
  username: string | undefined;
  profileImage: string | undefined;
}
interface InitialState {
  conversations: Conversation[];
  selectedConversation: SelectedConversation;
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
      state.conversations[conversationIndex].status = status;
    },
    setLastMessage(state, action) {
      const { conversationId, lastMessageContent, lastMessageTime } =
        action.payload;
      const conversationIndex = state.conversations.findIndex(
        (conversation) => conversation.id === conversationId
      );
      state.conversations[conversationIndex].lastMessageContent =
        lastMessageContent;
      state.conversations[conversationIndex].lastMessageTime = lastMessageTime;
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
