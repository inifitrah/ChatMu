import React from "react";
import EditProfile from "./EditProfile";
import { UserRound } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface User {
  name: string;
  username: string;
  email: string;
}

interface PersonalInformationProps {
  user: User;
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({ user }) => {
  return (
    <div className="flex flex-col space-y-1 w-full mt-5">
      <div className="flex justify-between items-center ">
        <h1 className="font-semibold">Personal information</h1>
        <EditProfile user={user} />
      </div>
      <Card>
        <CardContent className="rounded-xl flex justify-between bg-black p-3 text-white w-full">
          <div className=" flex gap-1 items-center text-white">
            <UserRound />
            <p className="text-sm">Username</p>
          </div>
          <h1 className="font-semibold">{user.username}</h1>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="rounded-xl flex justify-between bg-black p-3 text-white w-full">
          <div className=" flex gap-1 items-center text-white">
            <UserRound />
            <p className="text-sm">Email</p>
          </div>
          <h1 className="font-semibold">{user.email}</h1>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInformation;
