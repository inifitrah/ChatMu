import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/redux-toolkit/store";
import { shallowEqual } from "react-redux";

export const selectMessageByConversationId = createSelector(
  [
    (state: RootState) => state.conversation.messages,
    (_: RootState, conversationId: string) => conversationId,
    (_: RootState, __: string, userId: string) => userId,
  ],
  (messages, convesationId, userId) => {
    return messages
      .filter((message) => {
        return message.conversationId === convesationId;
      })
      .map((message) => {
        return {
          content: message.content,
          type: message.type,
          status: message.status,
          isCurrentUser: message.sender.id === userId,
        } as {
          content: string;
          type: "text" | "server";
          isCurrentUser: boolean;
          status: "sent" | "delivered" | "read";
        };
      });
  }
);
