"use client";
import ChatCard from "@/components/ChatCard";
import React from "react";
import { chatData } from "@/constant.js";
import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="">
        {chatData.map((chat) => (
          <Link href={`/chat/${chat.id}`} key={chat.id}>
            <ChatCard
              uriProfile={chat.uriProfile}
              user={chat.user}
              isRead={chat.isRead}
              message={chat.message}
              key={chat.id}
              date={chat.date}
              number={chat.number}
            />
          </Link>
        ))}
      </main>
    </>
  );
}
