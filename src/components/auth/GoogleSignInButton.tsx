"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";

import { cn } from "@/lib/utils";

const GoogleSignInButton = ({ className }: { className?: string }) => {
  return (
    <Button
      onClick={() => signIn("google")}
      size={"box"}
      className={cn("w-14 mx-auto h-14 flex border-2", className)}
      variant={"menu"}
    >
      <Image
        width={40}
        height={40}
        alt="svgImg"
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxwYXRoIGZpbGw9IiNGRkMxMDciIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0xLjY0OSw0LjY1Ny02LjA4LDgtMTEuMzAzLDhjLTYuNjI3LDAtMTItNS4zNzMtMTItMTJjMC02LjYyNyw1LjM3My0xMiwxMi0xMmMzLjA1OSwwLDUuODQyLDEuMTU0LDcuOTYxLDMuMDM5bDUuNjU3LTUuNjU3QzM0LjA0Niw2LjA1MywyOS4yNjgsNCwyNCw0QzEyLjk1NSw0LDQsMTIuOTU1LDQsMjRjMCwxMS4wNDUsOC45NTUsMjAsMjAsMjBjMTEuMDQ1LDAsMjAtOC45NTUsMjAtMjBDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiI+PC9wYXRoPjxwYXRoIGZpbGw9IiNGRjNEMDAiIGQ9Ik02LjMwNiwxNC42OTFsNi41NzEsNC44MTlDMTQuNjU1LDE1LjEwOCwxOC45NjEsMTIsMjQsMTJjMy4wNTksMCw1Ljg0MiwxLjE1NCw3Ljk2MSwzLjAzOWw1LjY1Ny01LjY1N0MzNC4wNDYsNi4wNTMsMjkuMjY4LDQsMjQsNEMxNi4zMTgsNCw5LjY1Niw4LjMzNyw2LjMwNiwxNC42OTF6Ij48L3BhdGg+PHBhdGggZmlsbD0iIzRDQUY1MCIgZD0iTTI0LDQ0YzUuMTY2LDAsOS44Ni0xLjk3NywxMy40MDktNS4xOTJsLTYuMTktNS4yMzhDMjkuMjExLDM1LjA5MSwyNi43MTUsMzYsMjQsMzZjLTUuMjAyLDAtOS42MTktMy4zMTctMTEuMjgzLTcuOTQ2bC02LjUyMiw1LjAyNUM5LjUwNSwzOS41NTYsMTYuMjI3LDQ0LDI0LDQ0eiI+PC9wYXRoPjxwYXRoIGZpbGw9IiMxOTc2RDIiIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0wLjc5MiwyLjIzNy0yLjIzMSw0LjE2Ni00LjA4Nyw1LjU3MWMwLjAwMS0wLjAwMSwwLjAwMi0wLjAwMSwwLjAwMy0wLjAwMmw2LjE5LDUuMjM4QzM2Ljk3MSwzOS4yMDUsNDQsMzQsNDQsMjRDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiI+PC9wYXRoPgo8L3N2Zz4="
      />
    </Button>
  );
};

export default GoogleSignInButton;
