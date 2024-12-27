import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

const ChatMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center ">
        <EllipsisVertical className="text-black" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Block</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChatMenu;
