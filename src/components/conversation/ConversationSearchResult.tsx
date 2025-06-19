import { cn } from "@/lib/utils";
import React, { RefObject } from "react";

interface ConversationSearchResultProps {
  resultContainerRef: RefObject<HTMLDivElement>;
  className?: string;
}

const ConversationSearchResult = ({
  resultContainerRef,
  className,
}: ConversationSearchResultProps) => {
  return (
    <div
      ref={resultContainerRef}
      className={cn(
        "absolute rounded-md bg-white flex-col p-2 px-7 w-full",
        className
      )}
    >
      <h2 className="text-lg text-black font-semibold">Search Results</h2>
      <p className="text-gray-500">No results found.</p>
    </div>
  );
};

export default ConversationSearchResult;
