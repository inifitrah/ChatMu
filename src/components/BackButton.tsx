import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ href }: { href: string }) => {
  return (
    <Link href={href}>
      <Button className="text-black" size={"box"} variant={"menu"}>
        <ArrowLeft size={30} />
      </Button>
    </Link>
  );
};

export default BackButton;
