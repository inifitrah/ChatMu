"use client";
import { Button } from "@chatmu/ui";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import { useToast } from "@chatmu/ui";
const Auth = () => {
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      redirect("/");
    }
  });

  const { toast } = useToast();

  return (
    <section className="flex wrapper-page  p-5 flex-col gap-7 h-screen items-center justify-evenly ">
      <Image
        width={100}
        height={100}
        className="w-full rounded-2xl"
        alt="Ilustration"
        src={"/svg/ilustration.svg"}
      />
      <div className=" text-center px-6 mt-2">
        <h1 className="font-bold text-4xl mb-2">Welcome to ChatMu</h1>
        <p className="text-sm ">
          ChatMu is a simple chat application that allows you to chat with your
          friends in real-time.
        </p>
      </div>
      <div className="flex-col w-full mt-2 flex space-y-2">
        <Link href={"/auth/signin"}>
          <Button className="rounded-[20px] h-14 w-full">SignIn</Button>
        </Link>
        <Link href={"/auth/signup"}>
          <Button className="rounded-[20px] h-14 w-full bg-primary/75">
            SignUp
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Auth;
