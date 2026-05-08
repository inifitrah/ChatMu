import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { IMessage, ISelectedConversation } from "@chatmu/shared";

import { IConversation } from "@chatmu/shared";
import { SearchResultItem } from "@chatmu/shared";
import { ChatSearchResult } from "@chatmu/shared";
import { UserSearchResult } from "@chatmu/shared";
import { MessageSearchResult } from "@chatmu/shared";
type MessageStatus = IMessage["status"];
type Conversation = Omit<IConversation, "message"> & {
  message?: {
    isCurrentUser: boolean;
    lastMessageTime?: Date;
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
  isSearchLoading: boolean;
  searchConversations: SearchResultItem[];
  currentUserId: string;
  users?: { id: string; username: string; name?: string; image?: string }[];
}

type ConversationAction =
  | { type: "SET_CURRENT_USER_ID"; payload: string }
  | { type: "SET_CONVERSATIONS"; payload: Conversation[] }
  | { type: "SET_SELECTED_CONVERSATION"; payload: ISelectedConversation | null }
  | { type: "SET_MESSAGES"; payload: IMessage[] }
  | {
    type: "MERGE_MESSAGES"; payload: {
      conversationId: string;
      messages: IMessage[];
    }
  }
  | {
    type: "UPDATE_MESSAGE_STATUS"; payload: {
      conversationId: IMessage["conversationId"];
      newStatus: IMessage["status"];
      tempId?: string;
      id?: string;
    }
  }
  | { type: "ADD_MESSAGE"; payload: IMessage }
  | { type: "SET_SEARCH_ACTIVE"; payload: boolean }
  | { type: "SET_SEARCH_LOADING"; payload: boolean }
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
      lastMessageTime: Date;
      lastMessageIsCurrentUser: boolean;
      status: MessageStatus;
    };
  }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SEARCH_CONVERSATIONS" }
  | { type: "SET_STATUS"; payload: "idle" | "loading" | "failed" }
  | { type: "SET_USERS"; payload: ConversationState["users"] }
  | {
      type: "RETRY_MESSAGE";
      payload: {
        tempId: string;
        conversationId: string;
        content: string;
        sender: { id: string; username: string };
        recipient: { id: string; username: string };
      };
    };

const initialState: ConversationState = {
  conversations: [],
  selectedConversation: null,
  messages: [],
  status: "idle",
  query: "",
  isSearchActive: false,
  isSearchLoading: false,
  searchConversations: [],
  currentUserId: "",
  users: [],
};

function conversationReducer(
  state: ConversationState,
  action: ConversationAction
): ConversationState {
  switch (action.type) {
    case "SET_CURRENT_USER_ID": {
      console.log("Setting current user ID:", action.payload);

      return {
        ...state,
        currentUserId: action.payload,
      };
    }

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
    case "MERGE_MESSAGES": {
      const { conversationId, messages: newMessages } = action.payload;
      const newIds = new Set(newMessages.map(m => m.id).filter(Boolean));
      const newTempIds = new Set(newMessages.map(m => m.tempId).filter(Boolean));

      const filteredExisting = state.messages.filter(msg => {
        if (msg.conversationId !== conversationId) return true;
        if (msg.id && newIds.has(msg.id)) return false;
        if (msg.tempId && newTempIds.has(msg.tempId)) return false;
        if (msg.status === "failed" || msg.status === "sending") return true;
        return false;
      });

      const merged = [...filteredExisting, ...newMessages];
      merged.sort((a, b) => {
        const ta = a.timeStamp instanceof Date ? a.timeStamp.getTime() : new Date(a.timeStamp).getTime();
        const tb = b.timeStamp instanceof Date ? b.timeStamp.getTime() : new Date(b.timeStamp).getTime();
        return ta - tb;
      });

      return {
        ...state,
        messages: merged,
      };
    }
    case "ADD_MESSAGE": {
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    }

    case "UPDATE_MESSAGE_STATUS": {
      const {
        conversationId,
        newStatus,
        tempId,
        id
      } = action.payload
      return {
        ...state,
        messages: state.messages.map((msg) => {
          if (msg.conversationId === conversationId) {
            if (tempId && (msg.id === tempId || msg.tempId === tempId)) {
              return {
                ...msg,
                id: id || msg.id,
                status: newStatus
              }
            } else if (!tempId && msg.status !== newStatus && msg.status !== "read") {
              return {
                ...msg, status: newStatus
              }
            }
          }
          return msg
        })
      }
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
    case "SET_SEARCH_LOADING": {
      return {
        ...state,
        isSearchLoading: action.payload,
      };
    }
    case "SET_SEARCH_CONVERSATIONS": {
      const query = state.query.toLowerCase().trim();

      if (!query) {
        return {
          ...state,
          searchConversations: [],
          isSearchLoading: false,
        };
      }

      const filteredConversations: ChatSearchResult[] = state.conversations
        .filter((conv) => {
          if (!query || query === "") return false;
          return conv.username.toLowerCase().includes(query);
        })
        .map((conv) => {
          return {
            conversationId: conv.conversationId,
            userId: conv.otherUserId,
            type: "chat" as const,
            title: conv.username,
            profileImage: conv.profileImage,
            timestamp: conv.message?.lastMessageTime,
            messagePreview: conv.message?.lastMessageContent,
            unreadCount: conv.message?.unreadMessageCount,
          };
        });

      const filteredUsers: UserSearchResult[] = (state.users || [])
        .filter((u) => {
          if (!query) return false;
          const filterUsername = u.username.toLowerCase().includes(query);
          const filterName = u.name
            ? u.name.toLowerCase().includes(query)
            : false;
          const excludeExistingChats = !state.conversations.some(
            (conv) => conv.username === u.username
          );
          const excludeCurrentUser = u.id !== state.currentUserId;
          console.log(state.currentUserId);
          return (
            (filterUsername || filterName) &&
            excludeExistingChats &&
            excludeCurrentUser
          );
        })
        .map((u) => ({
          userId: u.id,
          type: "user" as const,
          title: u.username,
          profileImage: u.image,
          messagePreview: u.name,
        }));

      const filteredMessages: MessageSearchResult[] = state.messages
        .filter((msg) => {
          if (!query || query === "") return false;

          const contentMatch = msg.content.toLowerCase().includes(query);
          const typeMatch = msg.type === "text";

          return contentMatch && typeMatch;
        })
        .map((msg) => {
          return {
            messageId: (msg.id || msg.tempId) as string,
            type: "message" as const,
            title: msg.sender.username,
            timestamp: msg.timeStamp,
            messagePreview: msg.content,
          };
        });

      const allResults = [
        ...filteredConversations,
        ...filteredMessages,
        ...filteredUsers,
      ];

      return {
        ...state,
        searchConversations: allResults,
        isSearchLoading: false,
      };
    }
    case "SET_STATUS": {
      return {
        ...state,
        status: action.payload,
      };
    }
    case "SET_USERS": {
      return { ...state, users: action.payload || [] };
    }
    case "RETRY_MESSAGE": {
      const { tempId, conversationId, content, sender, recipient } = action.payload;
      // Update message status to 'sending' to trigger UI
      return {
        ...state,
        messages: state.messages.map((msg) => {
          if (msg.tempId === tempId || msg.id === tempId) {
            return { ...msg, status: "sending" as const };
          }
          return msg;
        }),
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
    setCurrentUserId: (userId: string) => {
      dispatch({ type: "SET_CURRENT_USER_ID", payload: userId });
    },
    setConversations: (conversations: Conversation[]) => {
      dispatch({ type: "SET_CONVERSATIONS", payload: conversations });
    },
    setSelectedConversation: (conversation: ISelectedConversation | null) => {
      dispatch({ type: "SET_SELECTED_CONVERSATION", payload: conversation });
    },
    setMessages: (messages: IMessage[]) => {
      dispatch({ type: "SET_MESSAGES", payload: messages });
    },
    mergeMessages: (conversationId: string, messages: IMessage[]) => {
      dispatch({ type: "MERGE_MESSAGES", payload: { conversationId, messages } });
    },
    addMessage: (message: IMessage) => {
      dispatch({ type: "ADD_MESSAGE", payload: message });
    },
    updateMessageStatus: ({
      conversationId, newStatus, tempId, id
    }: {
      conversationId: IMessage["conversationId"], newStatus: MessageStatus, tempId?: string, id?: string
    }) => {
      dispatch({ type: "UPDATE_MESSAGE_STATUS", payload: { conversationId, newStatus, tempId, id } });
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
      lastMessageTime: Date;
      lastMessageIsCurrentUser: boolean;
      status: MessageStatus;
    }) => {
      dispatch({ type: "SET_LAST_MESSAGE", payload: data });
    },
    setIsSearchActive: (isActive: boolean) => {
      dispatch({ type: "SET_SEARCH_ACTIVE", payload: isActive });
    },
    setIsSearchLoading: (isLoading: boolean) => {
      dispatch({ type: "SET_SEARCH_LOADING", payload: isLoading });
    },
    setSearchQuery: (query: string) => {
      dispatch({ type: "SET_SEARCH_QUERY", payload: query });
      dispatch({ type: "SET_SEARCH_CONVERSATIONS" });
    },
    clearSearch: () => {
      dispatch({ type: "SET_SEARCH_QUERY", payload: "" });
      dispatch({ type: "SET_SEARCH_CONVERSATIONS" });
    },
    setUsers: (users: ConversationState["users"]) => {
      dispatch({ type: "SET_USERS", payload: users });
      // refresh search results if query exists
      dispatch({ type: "SET_SEARCH_CONVERSATIONS" });
    },
    retryMessage: (params: {
      tempId: string;
      conversationId: string;
      content: string;
      sender: { id: string; username: string };
      recipient: { id: string; username: string };
    }) => {
      dispatch({ type: "RETRY_MESSAGE", payload: params });
    },
  };
}
