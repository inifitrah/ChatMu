import { cn } from "@/lib/utils";
import React from "react";

const ConversationSearchResult = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute rounded-md border-pink-400", className)}>
      <div className="flex items-center justify-between  p-4 bg-background shadow-md rounded-lg">
        <h2 className="text-lg font-semibold">Search Results</h2>
        <p className="text-gray-500">No results found.</p>
      </div>
    </div>
  );
};

export default ConversationSearchResult;
