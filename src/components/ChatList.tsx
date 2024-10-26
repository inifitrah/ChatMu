"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import ChatCard from "./ChatCard";

const ChatList = () => {
  const currentUserId = "6718e1bac9b7c37002817409";
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConversations();
  }, []);

  async function getConversations() {
    const response = await fetch("http://localhost:3000/api/conversations", {
      method: "GET",
    });
    const data = await response.json();
    setConversations(data.data);
    setLoading(false);
  }

  return (
    <>
      {loading ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : (
        conversations.map((conversation) => (
          <ChatCard key={conversation._id} conversation={conversation} />
        ))
      )}
    </>
  );
};

export default ChatList;
