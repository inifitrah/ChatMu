"use client";
import React from "react";
import Menu from "./Menu";

import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Header = () => {
  return (
    <header className="flex justify-between p-4 mb-5 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-600">
      <h1 className="text-2xl font-semibold text-white">ChatMu</h1>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical size={30} className="text-white" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52 fixed top-2 -right-4 flex flex-col gap-1 bg-black text-white  rounded-md p-5">
          <DropdownMenuItem className="px-1 ">Profile</DropdownMenuItem>
          <DropdownMenuItem className="px-1">Settings</DropdownMenuItem>
          <DropdownMenuItem className="px-1">Help</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header;
