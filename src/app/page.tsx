"use client";
import Chat from "@/components/ChatCard";
import React from "react";

const chatData = [
  {
    uriProfile: "/images/siprogrammer.jpg",
    user: "Fitrah",
    isRead: false,
    message: "lorem ipsum dolor sit amet",
    id: 1,
    date: "Hari ini",
    number: 1000,
  },
  {
    uriProfile: "/images/user2.jpg",
    user: "John Doe",
    isRead: true,
    message: "Hello, how are you?",
    id: 2,
    date: "Kemarin",
    number: 500,
  },
  {
    uriProfile: "/images/user3.jpg",
    user: "Jane Smith",
    isRead: false,
    message: "Can we meet tomorrow?",
    id: 3,
    date: "2 hari yang lalu",
    number: 200,
  },
  {
    uriProfile: "/images/user4.jpg",
    user: "Alice Johnson",
    isRead: true,
    message: "Sure, see you then!",
    id: 4,
    date: "3 hari yang lalu",
    number: 150,
  },
];

export default function Home() {
  return (
    <main className="">
      {chatData.map((chat) => (
        <Chat
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
