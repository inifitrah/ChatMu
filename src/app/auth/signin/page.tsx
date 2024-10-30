"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { ArrowLeft, ArrowLeftCircle } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const SignIn = () => {
  const { data, status } = useSession();

  useEffect(() => {
    if (data && status === "authenticated") {
      redirect("/");
    }
  }, [data, status]);
  return (
    <div className="flex h-[90vhh] px-5 py-8 flex-col">
      <div>
        <Link href={"/auth"}>
          <Button size={40} variant={"icon"}>
            <ArrowLeft size={30} />
          </Button>
        </Link>
      </div>

      <div className="py-8 space-y-4">
        <h1 className="text-4xl font-semibold">Let's Sign you in.</h1>
        <h1 className="text-3xl">Welcome back</h1>
        <h1 className="text-3xl">You've been missed!</h1>
      </div>

      <form className=" py-3 space-y-4" action="">
        <div className="flex flex-col">
          <label className="text-sm" htmlFor="username">
            Username
          </label>
          <input
            placeholder="Username"
            id="username"
            className="py-3 px-5 rounded-2xl border-black border-2"
            type="text"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm" htmlFor="username">
            Email
          </label>
          <input
            placeholder="Username"
            id="email"
            className="py-3 px-5 rounded-2xl border-black border-2"
            type="email"
          />
        </div>
      </form>

      <div className="flex items-center my-10">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="mx-4">or</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>

      <div className="flex mb-5">
        <Button
          onClick={() => signIn("google")}
          size={50}
          className="w-14 mx-auto h-14 border-2"
          variant={"icon"}
        >
          <Image
            width={40}
            height={40}
            alt="svgImg"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxwYXRoIGZpbGw9IiNGRkMxMDciIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0xLjY0OSw0LjY1Ny02LjA4LDgtMTEuMzAzLDhjLTYuNjI3LDAtMTItNS4zNzMtMTItMTJjMC02LjYyNyw1LjM3My0xMiwxMi0xMmMzLjA1OSwwLDUuODQyLDEuMTU0LDcuOTYxLDMuMDM5bDUuNjU3LTUuNjU3QzM0LjA0Niw2LjA1MywyOS4yNjgsNCwyNCw0QzEyLjk1NSw0LDQsMTIuOTU1LDQsMjRjMCwxMS4wNDUsOC45NTUsMjAsMjAsMjBjMTEuMDQ1LDAsMjAtOC45NTUsMjAtMjBDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiI+PC9wYXRoPjxwYXRoIGZpbGw9IiNGRjNEMDAiIGQ9Ik02LjMwNiwxNC42OTFsNi41NzEsNC44MTlDMTQuNjU1LDE1LjEwOCwxOC45NjEsMTIsMjQsMTJjMy4wNTksMCw1Ljg0MiwxLjE1NCw3Ljk2MSwzLjAzOWw1LjY1Ny01LjY1N0MzNC4wNDYsNi4wNTMsMjkuMjY4LDQsMjQsNEMxNi4zMTgsNCw5LjY1Niw4LjMzNyw2LjMwNiwxNC42OTF6Ij48L3BhdGg+PHBhdGggZmlsbD0iIzRDQUY1MCIgZD0iTTI0LDQ0YzUuMTY2LDAsOS44Ni0xLjk3NywxMy40MDktNS4xOTJsLTYuMTktNS4yMzhDMjkuMjExLDM1LjA5MSwyNi43MTUsMzYsMjQsMzZjLTUuMjAyLDAtOS42MTktMy4zMTctMTEuMjgzLTcuOTQ2bC02LjUyMiw1LjAyNUM5LjUwNSwzOS41NTYsMTYuMjI3LDQ0LDI0LDQ0eiI+PC9wYXRoPjxwYXRoIGZpbGw9IiMxOTc2RDIiIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0wLjc5MiwyLjIzNy0yLjIzMSw0LjE2Ni00LjA4Nyw1LjU3MWMwLjAwMS0wLjAwMSwwLjAwMi0wLjAwMSwwLjAwMy0wLjAwMmw2LjE5LDUuMjM4QzM2Ljk3MSwzOS4yMDUsNDQsMzQsNDQsMjRDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiI+PC9wYXRoPgo8L3N2Zz4="
          />
        </Button>
      </div>

      <div className="flex-1 flex  ">
        <div className="self-end w-full">
          <p className="text-center">
            Dont have an account?{" "}
            <Link className="font-semibold" href={"/auth/signup"}>
              SignUp
            </Link>
          </p>
          <Link className="self-end w-full" href={"/auth/signin"}>
            <Button className="rounded-2xl text-xl h-14 w-full">SignIn</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
