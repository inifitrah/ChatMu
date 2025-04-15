import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import LogoutAlert from "@/components/auth/LogoutAlert";
import { signOut } from "next-auth/react";
const NavigationMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical size={30} className="text-black dark:text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <Link href="profile">
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>
        <Link href={"settings"}>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </Link>
        <LogoutAlert
          onConfirm={() => {
            signOut();
          }}
        >
          <DropdownMenuItem
            className="text-red-700  font-semibold"
            onClick={(e: any) => e.preventDefault()}
          >
            Logout
          </DropdownMenuItem>
        </LogoutAlert>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavigationMenu;
