"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import ChatCard from "./ChatCard";
import { useSession } from "next-auth/react";

const ChatList = () => {
  const { data: session } = useSession();

  const dummyConversation = {
    participants: [
      {
        _id: "1",
        username: "Fitrah",
        avatar: "https://randomuser.me",
        isOnline: true,
      },
      {
        _id: "2",
        username: "Ramadhan",
        avatar: "https://randomuser.me",
        isOnline: true,
      },
    ],
    lastMessage: {
      content: "Lorem ipsum dolor sit amet.",
    },
  };

  return (
    <>
      <ChatCard conversation={dummyConversation} />
    </>
  );
};

export default ChatList;
