"use client";
import ChatCard from "@/components/ChatCard";
import React from "react";
import { chatData } from "@/constant.js";

export default function Home() {
  return (
    <main className="">
      {chatData.map((chat) => (
        <ChatCard
          uriProfile={chat.uriProfile}
          user={chat.user}
          isRead={chat.isRead}
          message={chat.message}
          key={chat.id}
          date={chat.date}
          number={chat.number}
        />
      ))}
    </main>
  );
}
