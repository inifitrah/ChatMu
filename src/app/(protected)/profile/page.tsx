"use client";
import EditProfile from "@/components/profile/EditProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CircleUser, Pencil, UserRound } from "lucide-react";
import Link from "next/link";
import EditProfilePicture from "@/components/profile/EditProfilePicture";
import { useSession } from "next-auth/react";
import { useSocketContext } from "@/contexts/SocketContext";

const Profile = () => {
  const { connected } = useSocketContext();
  const { data: session } = useSession();
  if (!session) return <>Loading..</>;

  return (
    <section className="px-5">
      <Link href={"/"}>
        <Button size={"box"} className="mt-4 text-black" variant={"menu"}>
          <ArrowLeft size={30} />
        </Button>
      </Link>
      <div className=" flex w-full flex-col items-center justify-center gap-4">
        <div className="flex mt-16 relative">
          <Avatar className="text-black h-24 w-24 bg-black/10 ">
            <AvatarImage src={session.user.image} />
            <AvatarFallback>
              <CircleUser size={60} />
            </AvatarFallback>
          </Avatar>
          <EditProfilePicture
            profilePic={session.user.image}
            userId={session.user.id}
          />
        </div>
        <div className="text-center">
          <h1 className="font-semibold text-xl">{session.user.name}</h1>
          <p>{connected ? "online" : "offline"}</p>
        </div>
        <div className="flex flex-col space-y-1 w-full mt-5">
          <div className="flex justify-between items-center ">
            <h1 className="font-semibold">Personal information</h1>
            <EditProfile user={session.user} />
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
