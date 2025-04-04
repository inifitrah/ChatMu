"use client";
import React, { useState } from "react";

import { EllipsisVertical, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import ConversationSearch from "@/components/conversation/ConversationSearch";
import { useToast } from "@/hooks/use-toast";
import NavigationMenu from "@/components/header/NavigationMenu";
import { ThemeSwitch } from "../ThemeSwitch";

const Header = () => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const { toast } = useToast();
  return (
    <header className="flex flex-col p-4 gap-2 bg-black/80 border-b border-solid border-black/50">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-white">ChatMu</h1>
        <div className="space-x-4">
          <ThemeSwitch />
          <Button
            className=""
            onClick={() => setIsCommandOpen(!isCommandOpen)}
            size={"box"}
            variant={"menu"}
          >
            <Search size={27} />
          </Button>
          {isCommandOpen && (
            <ConversationSearch setIsCommandOpen={setIsCommandOpen} />
          )}
          <NavigationMenu />
        </div>
      </div>
      <div className="space-x-4 text-white">
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
