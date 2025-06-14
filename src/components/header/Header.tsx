"use client";
import React from "react";
import Image from "next/image";
import NavigationMenu from "@/components/header/NavigationMenu";
import { ThemeSwitch } from "../ThemeSwitch";
import ConversationSearch from "@/components/conversation/ConversationSearch";

const Header = () => {
  return (
    <header className="text-black flex flex-col px-7 pt-8 pb-2 bg-[#F8F8F8] dark:bg-[#0D0F12] dark:text-white">
      <div className="flex items-center justify-between mb-6 ">
        <div>
          <Image
            width={65}
            height={65}
            className="rounded-full block dark:hidden"
            alt="Logo"
            src={"/svg/logo.svg"}
          />
          <Image
            width={65}
            height={65}
            className="rounded-full dark:block hidden"
            alt="Logo"
            src={"/svg/darklogo.svg"}
          />
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitch />
          <NavigationMenu />
        </div>
      </div>
      <div>
        <ConversationSearch />
      </div>
    </header>
  );
};

export default Header;
