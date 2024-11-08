"use client";
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
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { CircleUser, Pencil } from "lucide-react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// const formSchema = z.object({
//   avatar: z.fil
// });

const EditProfilePicture = ({ currentAvatar }: { currentAvatar: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {},
  // });

  const saveChangesClick = () => {
    // form.handleSubmit(async (values: z.infer<typeof formSchema>) => {
    //   console.log(values);
    // })();
  };

  const [fileName, setFileName] = useState("Upload new profile picture");

  const [filePreview, setFilePreview] = useState("");

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
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
        gap-3 items-center
          "
        >
          <Avatar className="text-black h-24 w-24 ">
            <AvatarImage src={filePreview ? filePreview : currentAvatar} />
            <AvatarFallback>
              <CircleUser size={60} />
            </AvatarFallback>
          </Avatar>
          <form onSubmit={saveChangesClick} className=" flex flex-1 flex-col ">
            <label
              htmlFor="file-upload"
              className="cursor-pointer select-none text-center bg-black/10 text-black  p-4 rounded-2xl   text-sm"
            >
              {fileName}
            </label>
            <p className="text-xs px-2 text-gray-500 mt-2">
              File types supported: JPG, PNG, GIF. Max size: 5MB.
            </p>
            <input
              id="file-upload"
              onChange={handleFileChange}
              type="file"
              className="hidden"
            />
          </form>
        </div>

        {/* <Form {...form}>
          <form className="space-x-3 flex items-center">
            <Avatar className="text-black h-24 w-24 ">
              <AvatarImage src={""} />
              <AvatarFallback>
                <CircleUser size={60} />
              </AvatarFallback>
            </Avatar>
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="file" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form> */}
        <DialogFooter>
          <Button
            onClick={saveChangesClick}
            className="rounded-2xl"
            type="submit"
          >
            Save Canges
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfilePicture;
