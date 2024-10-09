"use client";
import React from "react";

import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Header = () => {
  return (
    <header className="flex justify-between p-4 mb-5 ">
      <h1 className="text-2xl font-semibold text-white">ChatMu</h1>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical size={25} className="text-inherit" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Help</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header;
