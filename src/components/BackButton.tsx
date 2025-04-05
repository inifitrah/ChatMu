import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ href }: { href: string }) => {
  return (
    <Link href={href}>
      <Button size={"box"} variant={"menu"}>
        <ArrowLeft className="text-foreground" size={30} />
      </Button>
    </Link>
  );
};

export default BackButton;
