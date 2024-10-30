import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Auth = () => {
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
        <Button className="rounded-full h-14 bg-gray-400 text-black">
          SignUp
        </Button>
      </div>
    </section>
  );
};

export default Auth;
