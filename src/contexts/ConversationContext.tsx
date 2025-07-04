import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { IMessage, ISelectedConversation } from "@/types/conversation";

import { IConversation } from "@/types/conversation";
type MessageStatus = IMessage["status"];
type Conversation = Omit<IConversation, "message"> & {
  message?: {
    isCurrentUser: boolean;
    lastMessageTime: string; // We'll convert Date to string for internal state
    lastMessageContent: string;
    unreadMessageCount?: number;
    status: MessageStatus;
  };
};

interface ConversationState {
  conversations: Conversation[];
  selectedConversation: ISelectedConversation | null;
  messages: IMessage[];
  status: "idle" | "loading" | "failed";
  query: string;
  isSearchActive: boolean;
  searchConversations: Conversation[];
}

type ConversationAction =
  | { type: "SET_CONVERSATIONS"; payload: Conversation[] }
  | { type: "SET_SELECTED_CONVERSATION"; payload: ISelectedConversation | null }
  | { type: "SET_MESSAGES"; payload: IMessage[] }
  | { type: "UPDATE_MESSAGES"; payload: IMessage[] }
  | { type: "ADD_MESSAGE"; payload: IMessage }
  | { type: "SET_SEARCH_ACTIVE"; payload: boolean }
  | {
      type: "UPDATE_CONVERSATION_STATUS";
      payload: {
        conversationId: string;
        status: MessageStatus;
      };
    }
  | {
      type: "SET_LAST_MESSAGE";
      payload: {
        conversationId: string;
        lastMessageContent: string;
        lastMessageTime: string;
        lastMessageIsCurrentUser: boolean;
        status: MessageStatus;
      };
    }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SEARCH_CONVERSATIONS" }
  | { type: "SET_STATUS"; payload: "idle" | "loading" | "failed" };

const initialState: ConversationState = {
  conversations: [],
  selectedConversation: null,
  messages: [],
  status: "idle",
  query: "",
  isSearchActive: false,
  searchConversations: [],
};

function conversationReducer(
  state: ConversationState,
  action: ConversationAction
): ConversationState {
  switch (action.type) {
    case "SET_CONVERSATIONS": {
      return {
        ...state,
        conversations: action.payload,
      };
    }
    case "SET_SELECTED_CONVERSATION": {
      return {
        ...state,
        selectedConversation: action.payload,
      };
    }
    case "SET_MESSAGES": {
      return {
        ...state,
        messages: action.payload,
      };
    }
    case "ADD_MESSAGE": {
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    }
    case "UPDATE_CONVERSATION_STATUS": {
      return {
        ...state,
        conversations: state.conversations.map((conv) => {
          return conv.message &&
            conv.conversationId === action.payload.conversationId
            ? {
                ...conv,
                message: {
                  ...conv.message,
                  status: action.payload.status,
                  unreadMessageCount:
                    action.payload.status === "read"
                      ? 0
                      : conv.message.unreadMessageCount || 0,
                },
              }
            : conv;
        }),
      };
    }
    case "SET_LAST_MESSAGE": {
      return {
        ...state,
        conversations: state.conversations.map((conv) => {
          return conv.conversationId === action.payload.conversationId
            ? {
                ...conv,
                message: {
                  ...(conv.message || {}),
                  unreadMessageCount: conv.message?.unreadMessageCount
                    ? conv.message.unreadMessageCount +
                      (action.payload.lastMessageIsCurrentUser ? 0 : 1)
                    : action.payload.lastMessageIsCurrentUser
                    ? 0
                    : 1,
                  lastMessageContent: action.payload.lastMessageContent,
                  lastMessageTime: action.payload.lastMessageTime,
                  isCurrentUser: action.payload.lastMessageIsCurrentUser,
                  status: action.payload.status,
                },
              }
            : conv;
        }),
      };
    }
    case "SET_SEARCH_ACTIVE": {
      return {
        ...state,
        isSearchActive: action.payload,
      };
    }
    case "SET_SEARCH_QUERY": {
      return {
        ...state,
        query: action.payload,
      };
    }
    case "SET_SEARCH_CONVERSATIONS": {
      const filteredConversations = state.conversations.filter((conv) => {
        const query = state.query.toLowerCase().trim();
        if (!query || query === "") return;
        return conv.username.toLowerCase().includes(query);
      });

      return {
        ...state,
        searchConversations: filteredConversations,
      };
    }
    case "SET_STATUS": {
      return {
        ...state,
        status: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}

interface ConversationContextValue extends ConversationState {
  dispatch: React.Dispatch<ConversationAction>;
}

const ConversationContext = createContext<ConversationContextValue | undefined>(
  undefined
);

export function ConversationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(conversationReducer, initialState);

  const value = {
    ...state,
    dispatch,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error(
      "useConversation must be used within a ConversationProvider"
    );
  }
  return context;
}

// Helper hooks for common operations
export function useConversationActions() {
  const { dispatch } = useConversation();

  return {
    setConversations: (conversations: Conversation[]) => {
      dispatch({ type: "SET_CONVERSATIONS", payload: conversations });
    },
    setSelectedConversation: (conversation: ISelectedConversation | null) => {
      dispatch({ type: "SET_SELECTED_CONVERSATION", payload: conversation });
    },
    addMessage: (message: IMessage) => {
      dispatch({ type: "ADD_MESSAGE", payload: message });
    },
    updateMessages: (messages: IMessage[]) => {
      dispatch({ type: "UPDATE_MESSAGES", payload: messages });
    },
    updateConversationStatus: (
      conversationId: string,
      status: MessageStatus
    ) => {
      dispatch({
        type: "UPDATE_CONVERSATION_STATUS",
        payload: { conversationId, status },
      });
    },
    setLastMessage: (data: {
      conversationId: string;
      lastMessageContent: string;
      lastMessageTime: string;
      lastMessageIsCurrentUser: boolean;
      status: MessageStatus;
    }) => {
      dispatch({ type: "SET_LAST_MESSAGE", payload: data });
    },
    setIsSearchActive: (isActive: boolean) => {
      dispatch({ type: "SET_SEARCH_ACTIVE", payload: isActive });
    },
    setSearchQuery: (query: string) => {
      dispatch({ type: "SET_SEARCH_QUERY", payload: query });
      dispatch({ type: "SET_SEARCH_CONVERSATIONS" });
    },
    clearSearch: () => {
      dispatch({ type: "SET_SEARCH_QUERY", payload: "" });
    },
  };
}
