"use client";
import React from "react";
import Header from "@/components/Header";
import ChatList from "@/components/ChatList";

export default function Home() {
  return (
    <>
      <Header />
      <main className="">
        <ChatList />
      </main>
    </>
  );
}
