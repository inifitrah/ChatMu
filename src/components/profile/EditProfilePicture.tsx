"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { CircleUser, Pencil } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfilePicture } from "@/app/actions/userActions";
import { useFormStatus } from "react-dom";

const EditProfilePicture = ({
  profilePic,
  userId,
}: {
  profilePic: string;
  userId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const status = useFormStatus();

  const { toast } = useToast();

  const [fileName, setFileName] = useState("Upload new profile picture");

  const [filePreview, setFilePreview] = useState("");

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: any) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (file) {
      setFile(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFilePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async (e: any) => {
    try {
      e.preventDefault();

      if (!file) {
        toast({
          variant: "destructive",
          description: "Please select a file to upload",
        });
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      setLoading(true);
      const update = await updateProfilePicture({ formData, userId });
      if (update?.success) {
        toast({
          description: update.message,
        });
        setFile(null);
        setFileName("Upload new profile picture");
        setIsOpen(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="absolute bottom-0 right-0 rounded-full p-1 h-7 w-7">
          <Pencil size={100} className=" p-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile Picture</DialogTitle>
        </DialogHeader>
        <div
          className="flex justify-center
        gap-5 items-center
          "
        >
          <div className="bg-foreground/10 h-full w-auto px-7 flex  items-center rounded-2xl">
            <Avatar className="text-black bg-white h-24 w-24 ">
              <AvatarImage src={filePreview ? filePreview : profilePic} />
              <AvatarFallback>
                <CircleUser size={60} />
              </AvatarFallback>
            </Avatar>
          </div>
          <form onSubmit={handleSaveChanges} className=" flex flex-1 flex-col ">
            <label
              htmlFor="file-upload"
              className="cursor-pointer select-none text-center bg-foreground/10 text-foreground  p-4 rounded-2xl   text-sm"
            >
              {fileName}
            </label>
            <p className="text-xs text-center px-2 text-gray-500 my-2">
              File types supported: JPG, PNG, GIF. Max size: 5MB.
            </p>
            <input
              id="file-upload"
              onChange={handleFileChange}
              type="file"
              className="hidden"
            />
            <Button disabled={loading} type="submit" className="rounded-2xl">
              {loading ? "Uploading..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfilePicture;
