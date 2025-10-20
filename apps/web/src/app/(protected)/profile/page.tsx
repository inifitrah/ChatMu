"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@chatmu/ui";
import { Button } from "@chatmu/ui";
import { ArrowLeft, CircleUser } from "lucide-react";
import Link from "next/link";
import EditProfilePicture from "@/components/profile/EditProfilePicture";
import { useSession } from "next-auth/react";
import { useSocketContext } from "@/contexts/SocketContext";
import PersonalInformation from "@/components/profile/PersonalInformation";

const Profile = () => {
  const { connected } = useSocketContext();
  const { data: session } = useSession();
  if (!session) return <>Loading..</>;

  return (
    <section className="px-5 wrapper-page">
      <Link href={"/"}>
        <Button size={"box"} className="mt-4 text-foreground" variant={"menu"}>
          <ArrowLeft size={30} />
        </Button>
      </Link>
      <div className=" flex w-full flex-col items-center justify-center gap-4">
        <div className="flex mt-16 relative">
          <Avatar className="text-foreground h-24 w-24 bg-background">
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
        <PersonalInformation user={session.user} />
      </div>
    </section>
  );
};

export default Profile;
