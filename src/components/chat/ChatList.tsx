"use client";
import React from "react";
import ChatCard from "./ChatCard";

const ChatList = () => {
  return (
    <>
      <ChatCard
        profileImage="https://example.com/user.jpg"
        username="John Doe"
        lastMessageTime="Yesterday"
        lastMessageContent="Hello, how are you?"
        unreadMessageCount={3}
      />
      <ChatCard
        profileImage="https://example.com/user.jpg"
        username="John Doe"
        lastMessageTime="Yesterday"
        lastMessageContent="Hello, My name s John Doe"
        unreadMessageCount={6}
      />
    </>
  );
};

export default ChatList;
