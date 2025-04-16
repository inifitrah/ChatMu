import React from "react";
import { cn } from "@/lib/utils";

const DividerWithText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center my-10", className)}>
      <div className="flex-grow border-t"></div>
      <span className="mx-4">{text}</span>
      <div className="flex-grow border-t"></div>
    </div>
  );
};

export default DividerWithText;
