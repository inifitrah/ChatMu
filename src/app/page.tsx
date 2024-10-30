"use client";
import React, { useEffect } from "react";
import Header from "@/components/Header";
import ChatList from "@/components/ChatList";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    console.log("session", session);
    if (!session) {
      redirect("/auth");
    }
  }, [session]);
  return (
    <>
      <Header />
      <main className="">
        <ChatList />
      </main>
    </>
  );
}
