import { cn } from "@/lib/utils";
import React from "react";

const ConversationSearchResult = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute rounded-md bg-background flex-col p-2 h-40 w-full",
        className
      )}
    >
      <h2 className="text-lg font-semibold">Search Results</h2>
      <p className="text-gray-500">No results found.</p>
    </div>
  );
};

export default ConversationSearchResult;
