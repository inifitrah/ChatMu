"use client";
import React, { useState } from "react";

import { EllipsisVertical, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ChatSearch from "./ChatSearch";
import { signOut } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  return (
    <header className="flex flex-col p-4 gap-2">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-white">ChatMu</h1>
        <div className="space-x-1">
          <Button
            onClick={() => setIsCommandOpen(!isCommandOpen)}
            size={"icon"}
            variant={"menu"}
          >
            <Search size={27} />
          </Button>
          {isCommandOpen && <ChatSearch setIsCommandOpen={setIsCommandOpen} />}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical size={27} className="text-inherit" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="">
              <Link href="profile">
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help</DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                SignOut
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="space-x-4">
        <Button size={"sm"} variant={"filter"}>
          Semua
        </Button>
        <Button size={"sm"} variant={"filter"}>
          Favorit
        </Button>
        <Button size={"sm"} variant={"filter"}>
          Grup
        </Button>
      </div>
    </header>
  );
};

export default Header;
