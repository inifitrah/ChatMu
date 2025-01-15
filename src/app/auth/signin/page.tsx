"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthToast } from "@/hooks/useAuthToast";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { LoginSchema } from "@/schemas/zod.schemas";
import DividerWithText from "@/components/auth/DividerWithText";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import CardWrapper from "@/components/auth/CardWrapper";
import FormSignIn from "@/components/auth/FormSignin";

const SignIn = () => {
  const { toast } = useToast();
  useAuthToast();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
      toast({
        variant: "destructive",
        description: "Invalid fields",
      });
      return;
    }

    const { email, password } = validatedFields.data;
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      if (result.error === "EmailNotVerified") {
        toast({
          title: `Email Not Verified`,
          description: "Please check your email to verify",
        });
      } else {
        toast({
          variant: "destructive",
          description: result.error,
        });
      }
    }
  };

  return (
    <CardWrapper
      backButtonHref="/auth"
      headerTitle="Sign in to your account"
      headerSubtitle="Welcome back"
      headerSubtitle2="You've been missed!"
    >
      <FormSignIn form={form} />
      <DividerWithText text="or" />
      <GoogleSignInButton className="mb-8" />
      <p className="text-center">
        Don't have an account?{" "}
        <Link className="font-semibold" href={"/auth/signup"}>
          SignUp
        </Link>
      </p>
      <Button
        onClick={form.handleSubmit(handleSignIn)}
        className="rounded-2xl text-xl h-14 w-full"
      >
        SignIn
      </Button>
    </CardWrapper>
  );
};

export default SignIn;
