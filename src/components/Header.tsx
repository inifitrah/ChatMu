"use client";
import React from "react";

import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex flex-col p-4 gap-2">
      <div className="flex justify-between">
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
      </div>
      <div className="space-x-4">
        <Button size={"sm"} variant={"menu"}>
          Semua
        </Button>
        <Button size={"sm"} variant={"menu"}>
          Favorit
        </Button>
        <Button size={"sm"} variant={"menu"}>
          Grup
        </Button>
      </div>
    </header>
  );
};

export default Header;
