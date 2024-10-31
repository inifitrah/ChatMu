"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
const Auth = () => {
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      redirect("/");
    }
  });

  const { toast } = useToast();

  return (
    <section className="flex p-5 flex-col gap-5 h-screen justify-center">
      <div className=" text-center px-6">
        <h1 className="font-bold text-4xl mb-2">Welcome to ChatMu</h1>
        <p className="text-sm ">
          ChatMu is a simple chat application that allows you to chat with your
          friends in real-time.
        </p>
      </div>
      <div className="flex-col  px-3 flex space-y-2">
        <Link href={"/auth/signin"}>
          <Button className="rounded-full h-14 w-full">SignIn</Button>
        </Link>
        <Button
          onClick={() => {
            toast({
              title: "Halaman belum tersedia",
              description: "Coming soon.",
            });
          }}
          className="rounded-full h-14 bg-gray-400 hover:text-white text-black"
        >
          SignUp
        </Button>
      </div>
    </section>
  );
};

export default Auth;
