import { configureStore } from "@reduxjs/toolkit";
import conversationSlice from "./features/conversations/conversationSlice";
import userSlice from "./features/users/userSlice";

export const store = configureStore({
  reducer: {
    conversation: conversationSlice,
    user: userSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
