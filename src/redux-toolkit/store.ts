import { configureStore } from "@reduxjs/toolkit";
import conversationSlice from "./features/conversations/conversationSlice";

export const store = configureStore({
  reducer: {
    conversation: conversationSlice,
  },
});
