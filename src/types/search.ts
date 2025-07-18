export interface SearchResultItem {
  id: string;
  type: "chat" | "user" | "message";
  title: string;
  subtitle?: string;
  profileImage?: string;
  timestamp?: Date;
  messagePreview?: string;
  isOnline?: boolean;
  unreadCount?: number;
  matchedText?: string;
  chatId?: string;
  userId?: string;
  messageId?: string;
}

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
