"use client";
import React from "react";

import { chatData } from "@/constant";
import { useParams } from "next/navigation";
const Page = () => {
  const { id } = useParams<{ id: string }>();
  const person = chatData.filter((item) => item.id === parseInt(id))[0];

  return <div>chat by: {person.user}</div>;
};

export default Page;
