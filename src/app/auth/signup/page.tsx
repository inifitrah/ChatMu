"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthToast } from "@/hooks/useAuthToast";
import { createUser } from "@/app/actions/createUser";
import { useToast } from "@/hooks/use-toast";
import { SignupSchema } from "@/schemas/zod.schemas";

const SignUp = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  useAuthToast();

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSignUp = async (values: z.infer<typeof SignupSchema>) => {
    const createNewUser = await createUser(values);

    if (!createNewUser.success) {
      toast({
        variant: "destructive",
        title: createNewUser.message,
      });
    }
    if (createNewUser.success) {
      toast({
        description: createNewUser.message,
      });
    }
  };
  return (
    <div className="flex h-screen px-5 py-8 flex-col">
      <div>
        <Link href={"/auth"}>
          <Button className="text-black" size={"box"} variant={"menu"}>
            <ArrowLeft size={30} />
          </Button>
        </Link>
      </div>

      <div className="py-8 space-y-4">
        <h1 className="text-4xl font-semibold">Create your account</h1>
        <h1 className="text-3xl">Join us today</h1>
        <h1 className="text-3xl">Let's get started!</h1>
      </div>

      <Form {...form}>
        <form action="" className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fullname</FormLabel>
                <FormControl>
                  <Input
                    className="py-6 border-2 w-full px-3 border-black rounded-2xl h-10 disabled:cursor-not-allowed"
                    placeholder="Fullname"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="py-6 border-2 w-full px-3 border-black rounded-2xl h-10 disabled:cursor-not-allowed"
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="py-6 border-2 w-full px-3 pr-12 border-black rounded-2xl h-10 disabled:cursor-not-allowed"
                      placeholder="Password"
                      {...field}
                    />
                    <div
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute  inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="flex items-center my-10">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="mx-4">or</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>

      <div className="flex mb-5">
        <Button
          onClick={() => signIn("google")}
          size={"box"}
          className="w-14 mx-auto h-14 border-2"
          variant={"menu"}
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
            You have an account?{" "}
            <Link className="font-semibold" href={"/auth/signin"}>
              SignIn
            </Link>
          </p>

          <Button
            onClick={form.handleSubmit(handleSignUp)}
            className="rounded-2xl text-xl h-14 w-full"
          >
            SignUp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
