"use client";
import React from "react";

import { CircleUser } from "lucide-react";
import NavigationMenu from "@/components/header/NavigationMenu";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ThemeSwitch } from "../ThemeSwitch";

const Header = () => {
  return (
    <header className="text-black flex flex-col px-8 pt-8 pb-2 bg-[#F8F8F8] dark:bg-[#0D0F12] dark:text-white">
      <div className="flex items-center justify-between mb-6 ">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={"session.user.image"} />
            <AvatarFallback>
              <CircleUser size={60} />
            </AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            ChatMu
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitch />
          <NavigationMenu />
        </div>
      </div>
      <div>
        <Input className="" placeholder="Search" />
      </div>
    </header>
  );
};

export default Header;
