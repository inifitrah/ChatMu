interface BaseSearchResult {
  title: string;
  subtitle?: string;
  profileImage?: string;
  isOnline?: boolean;
}

export interface ChatSearchResult extends BaseSearchResult {
  type: "chat";
  conversationId: string;
  userId: string;
  timestamp?: Date;
  messagePreview?: string;
  unreadCount?: number;
}

export interface UserSearchResult extends BaseSearchResult {
    type: "user";
    userId: string;
    messagePreview?: string;
}

export interface MessageSearchResult extends BaseSearchResult {
    type: "message";
    messageId: string;
    timestamp: Date;
    messagePreview: string;
    matchedText?: string;
}

export type SearchResultItem =
  | ChatSearchResult
  | UserSearchResult
  | MessageSearchResult;

export interface SearchFilters {
  includeChats?: boolean;
  includeUsers?: boolean;
  includeMessages?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface SearchResponse {
  results: SearchResultItem[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface SearchRequestParams {
  query: string;
  limit?: number;
  cursor?: string;
  filters?: SearchFilters;
}
