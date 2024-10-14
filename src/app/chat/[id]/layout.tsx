"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { chatData } from "@/constant";
import { ArrowLeft, CircleUser, EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      {children}
    </>
  );
}
