import { createSlice, current } from "@reduxjs/toolkit";
import {
  IConversation,
  ISelectedConversation,
  IMessage,
} from "@/types/conversation";
import { fetchSearchConversations } from "./conversationThunks";
interface InitialState {
  conversations: IConversation[];
  messages: IMessage[];
  selectedConversation: ISelectedConversation | null;
  searchConversations: IConversation[];
  query: string;
  status?: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: InitialState = {
  conversations: [],
  messages: [],
  selectedConversation: null,
  searchConversations: [],
  query: "",
  status: "idle",
};
const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    clearSearch(state) {
      state.query = "";
      state.searchConversations = [];
      state.status = "idle";
    },
    setConversations(state, action) {
      state.conversations = action.payload;
    },
    setConversationStatus(
      state,
      action: {
        payload: {
          conversationId: string;
          status: "sent" | "delivered" | "read";
        };
      }
    ) {
      const { conversationId, status } = action.payload;
      const conversationIndex = state.conversations.findIndex(
        (conversation) => conversation.id === conversationId
      );

      // Check if the conversation exists or if the message status is already set
      if (!state.conversations[conversationIndex].message) return;

      // Update the status of the conversation
      state.conversations[conversationIndex].message.status = status;
      // Update the status of the message in the messages array
      state.messages.forEach((msg) => {
        if (msg.conversationId === conversationId && msg.status !== status) {
          msg.status = status;
        }
      });

      // Update the unread message count if the status is "read"
      if (
        state.messages.length > 0 &&
        state.conversations[conversationIndex].message.status === "read"
      ) {
        state.conversations[conversationIndex].message.unreadMessageCount = 0;
      }
    },
    setMessage(state, action: { payload: IMessage }) {
      const { conversationId, status } = action.payload;
      state.messages = [...state.messages, action.payload];

      if (status === "sent" || status === "delivered") {
        const conversationIndex = state.conversations.findIndex((conv) => {
          return conv.id === conversationId;
        });

        if (conversationIndex >= 0) {
          if (!state.conversations[conversationIndex].message) return;
          const currentCount =
            state.conversations[conversationIndex].message.unreadMessageCount ||
            0;
          state.conversations[conversationIndex].message.unreadMessageCount =
            currentCount + 1;
        }
      }
    },
    setLastMessage(state, action) {
      const { conversationId, lastMessageContent, lastMessageTime } =
        action.payload;
      const conversationIndex = state.conversations.findIndex(
        (conversation) => conversation.id === conversationId
      );

      if (!state.conversations[conversationIndex].message) return;

      state.conversations[conversationIndex].message.lastMessageContent =
        lastMessageContent;
      state.conversations[conversationIndex].message.lastMessageTime =
        lastMessageTime;
    },
    setSelectedConversation(state, action: { payload: ISelectedConversation }) {
      state.selectedConversation = action.payload;

      // Auto mark as read when a conversation is selected
      const conversationIndex = state.conversations.findIndex((conv) => {
        return conv.id === action.payload.id;
      });

      const message = state.conversations[conversationIndex].message;
      const messages = state.messages;

      if (conversationIndex >= 0 && message) {
        message.unreadMessageCount = 0;
        message.status = "read";

        messages.forEach((msg) => {
          if (
            msg.conversationId === action.payload.id &&
            msg.status !== "read" &&
            msg.sender.id === action.payload.userId
          ) {
            msg.status = "read";
          }
        });
      }
    },
    clearSelectedConversation(state) {
      state.selectedConversation = initialState.selectedConversation;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchConversations.pending, (state, action) => {
        state.status = "loading";
        state.query = action.meta.arg.username;
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
  setMessage,
  setLastMessage,
  setConversationStatus,
  clearSearch,
} = conversationSlice.actions;

export default conversationSlice.reducer;
