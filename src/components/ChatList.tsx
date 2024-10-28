"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import ChatCard from "./ChatCard";
import { useSession } from "next-auth/react";

const ChatList = () => {
  const { data: session } = useSession();

  useEffect(() => {
    console.log(session?.user);
  });

  return <></>;
};

export default ChatList;
