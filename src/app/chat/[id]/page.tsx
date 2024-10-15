"use client";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CircleUser,
  EllipsisVertical,
  SendHorizontal,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { chatData } from "@/constant";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
const Page = () => {
  const { id } = useParams<{ id: string }>();
  const person = chatData.filter((item) => item.id === parseInt(id))[0];

  return (
    <>
      <header className="flex justify-between p-4 items-center text-white">
        <div className="flex gap-2 items-center">
          <Link href={"/"}>
            <Button size={"icon"} variant={"menu"}>
              <ArrowLeft />
            </Button>
          </Link>
          <Avatar className="text-black">
            <AvatarImage src={person.uriProfile} />
            <AvatarFallback>
              <CircleUser size={60} />
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-xl font-bold">{person.user}</h1>
            <p className="text-sm ">{person.status}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center ">
            <EllipsisVertical className="text-inherit" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Block</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <ChatWindow />
      <ChatInput />
    </>
  );
};

interface chatMessageProps {
  isCurrentUser?: boolean;
  message: string;
}

const ChatMessage: React.FC<chatMessageProps> = ({
  isCurrentUser,
  message,
}) => {
  return (
    <div className="w-full">
      <div
        className={cn("w-full flex  px-2", isCurrentUser && "justify-end mt-2")}
      >
        <div className="rounded-xl overflow-hidden max-w-xs">
          <div className={cn("bg-sky-200 p-3", isCurrentUser && "bg-sky-300")}>
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatInput = () => {
  return (
    <div className="px-3 flex gap-1 py-3 w-full">
      <Input className="border-2" type="text" />
      <Button className="text-black rounded-sm bg-sky-300" variant={"menu"}>
        <SendHorizontal />
      </Button>
    </div>
  );
};

const ChatWindow = () => {
  return (
    <div className="flex flex-1 flex-col overflow-auto py-5 pb-10">
      <ChatMessage message="P" />

      <ChatMessage message="Why?" isCurrentUser={true} />
    </div>
  );
};

export default Page;
