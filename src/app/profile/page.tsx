"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CircleUser, Mail, Pencil, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const Profile = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      redirect("/signin");
    }
  }, [session]);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <section className="px-5">
      <Link href={"/"}>
        <Button size={40} className="mt-4" variant={"icon"}>
          <ArrowLeft size={30} />
        </Button>
      </Link>

      <div className=" flex w-full flex-col items-center justify-center gap-4">
        <Avatar className="text-black h-24 w-24 mt-16">
          <AvatarImage src={session.user.image} />
          <AvatarFallback>
            <CircleUser size={60} />
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h1 className="font-semibold text-xl">{session.user.name}</h1>
          <p>online</p>
        </div>
        <div className="flex flex-col space-y-1 w-full mt-5">
          <div className="flex justify-between ">
            <h1 className="font-semibold">Personal information</h1>
            <div className="flex cursor-pointer">
              <Pencil size={19} className="text-violet-800" />
              <p className="text-violet-800 font-semibold">Edit</p>
            </div>
          </div>
          <Card>
            <CardContent className="rounded-xl flex justify-between bg-black p-3 text-white w-full">
              <div className=" flex gap-1 items-center text-white">
                <UserRound />
                <p className="text-sm">Username</p>
              </div>
              <h1 className="font-semibold">{session.user.username}</h1>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="rounded-xl flex justify-between bg-black p-3 text-white w-full">
              <div className=" flex gap-1 items-center text-white">
                <UserRound />
                <p className="text-sm">Email</p>
              </div>
              <h1 className="font-semibold">{session.user.email}</h1>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Profile;
