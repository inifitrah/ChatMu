import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React from "react";
import { Pencil } from "lucide-react";
import { useSession } from "next-auth/react";

const EditProfile = () => {
  const { data: session } = useSession();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="flex px-2 cursor-pointer items-center">
          <Pencil size={17} className="" />
          <p className="font-semibold">Edit</p>
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue={session?.user?.name || ""}
              className="py-2 px-3 rounded-2xl col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue={session?.user?.username || ""}
              className="py-2 px-3 rounded-2xl col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button className="rounded-2xl" type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
