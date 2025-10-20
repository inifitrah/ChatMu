"use client";
import { cn } from "@chatmu/ui";
import React, { RefObject } from "react";
import { Search, MessageCircle, User, Hash, Clock } from "lucide-react";
import ConversationProfile from "./ConversationProfile";
import { Badge } from "@chatmu/ui";
import { SearchResultItem } from "@chatmu/shared";
import { formatLastMessageTime } from "@chatmu/shared";

interface ConversationSearchResultProps {
  resultContainerRef: RefObject<HTMLDivElement>;
  className?: string;
  searchQuery?: string;
  results?: SearchResultItem[];
  isLoading?: boolean;
  onItemClick?: (item: SearchResultItem) => void;
}

const ConversationSearchResult = ({
  resultContainerRef,
  className,
  searchQuery = "",
  results = [],
  isLoading = false,
  onItemClick,
}: ConversationSearchResultProps) => {
  const filteredResults =
    results.length > 0
      ? results.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.messagePreview
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      : [];

  const getResultIcon = (type: SearchResultItem["type"]) => {
    switch (type) {
      case "chat":
        return <MessageCircle size={16} className="text-blue-500" />;
      case "user":
        return <User size={16} className="text-green-500" />;
      case "message":
        return <Hash size={16} className="text-orange-500" />;
      default:
        return <Search size={16} className="text-gray-500" />;
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          className="bg-yellow-200 dark:bg-yellow-800 font-medium"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleItemClick = (item: SearchResultItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <div
      ref={resultContainerRef}
      className={cn(
        "absolute mx-0 px-6 min-h-screen top-full left-0 right-0 mt-1 bg-background max-h-96 overflow-y-auto z-50",
        "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2",
        className
      )}
    >
      {!searchQuery && !isLoading && filteredResults.length === 0 && (
        <div className="p-6 text-center">
          <Search size={48} className="mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="text-sm font-medium text-foreground mb-1">
            Start typing to search
          </h3>
          <p className="text-xs text-muted-foreground">
            Search for people, chats, or messages
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm text-muted-foreground">Searching...</span>
          </div>
        </div>
      ) : filteredResults.length > 0 ? (
        <div className="py-2">
          {/* Results by Category */}
          {["user", "chat", "message"].map((category) => {
            const categoryResults = filteredResults.filter(
              (item) => item.type === category
            );

            if (categoryResults.length === 0) return null;

            return (
              <div key={category} className="py-1">
                <div className="px-4 py-2 bg-muted/30">
                  <div className="flex items-center space-x-2">
                    {getResultIcon(category as SearchResultItem["type"])}
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {category === "user"
                        ? "People"
                        : category === "chat"
                        ? "Chats"
                        : "Messages"}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {categoryResults.length}
                    </Badge>
                  </div>
                </div>

                {categoryResults.map((item) => {
                  console.log({ item });
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <ConversationProfile
                        src={item.profileImage}
                        isOnline={item.isOnline}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-foreground truncate">
                            {highlightText(item.title, searchQuery)}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {item.timestamp && (
                              <span className="text-xs text-muted-foreground flex items-center">
                                <Clock size={12} className="mr-1" />
                                {formatLastMessageTime(item.timestamp)}
                              </span>
                            )}
                            {(item.unreadCount || 0) > 0 && (
                              <Badge className="bg-primary text-primary-foreground text-xs">
                                {item.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground truncate">
                            {item.type === "message" && item.messagePreview
                              ? highlightText(item.messagePreview, searchQuery)
                              : item.subtitle
                              ? highlightText(item.subtitle, searchQuery)
                              : ""}
                          </p>
                          {item.type === "message" && item.matchedText && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              #{item.matchedText}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : (
        searchQuery && (
          <div className="p-6 text-center">
            <Search
              size={48}
              className="mx-auto text-muted-foreground/50 mb-3"
            />
            <h3 className="text-sm font-medium text-foreground mb-1">
              No results found
            </h3>
            <p className="text-xs text-muted-foreground">
              Try searching for people, chats, or messages
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default ConversationSearchResult;
