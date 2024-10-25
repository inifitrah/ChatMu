"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import ChatCard from "./ChatCard";

const ChatList = () => {
  const currentUserId = "6718e1bac9b7c37002817409";
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConversations();
  }, []);

  async function getConversations() {
    const response = await fetch("http://localhost:3000/api/conversation");
    const data = await response.json();
    setConversations(data.data);
    setLoading(false);
  }

  return (
    <>
      loading ? (<div>Loading...</div>) : (
      {conversations.map((chat) => (
        <Link href={`/chat/${chat._id}`} key={chat._id}>
          <ChatCard
            user={chat.user}
            isRead={chat.isRead}
            message={chat.message}
            key={chat.id}
            date={chat.date}
            number={chat.number}
          />
        </Link>
      ))}
      )
    </>
  );
};

export default ChatList;
