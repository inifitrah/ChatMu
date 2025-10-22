"use client";
import { Button } from "@chatmu/ui";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthToast } from "@/hooks/useAuthToast";
import { useToast } from "@chatmu/ui";
import { SignupSchema } from "@chatmu/shared";
import DividerWithText from "@/components/auth/DividerWithText";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import FormSignUp from "@/components/auth/FormSignUp";
import CardWrapper from "@/components/auth/CardWrapper";
import { createUser } from "@/app/actions/userActions";

const SignUp = () => {
  const { toast } = useToast();

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
    <CardWrapper
      backButtonHref="/auth"
      headerTitle="Create your account"
      headerSubtitle="Join us today"
      headerSubtitle2="Let's get started!"
    >
      <FormSignUp form={form} />
      <DividerWithText text="or" />
      <GoogleSignInButton className="mb-8" />
      <p className="text-center">
        You have an account?{" "}
        <Link className="font-semibold" href={"/auth/signin"}>
          SignIn
        </Link>
      </p>
      <Button
        onClick={form.handleSubmit(handleSignUp)}
        className="rounded-[20px] text-xl h-14 w-full"
      >
        SignUp
      </Button>
    </CardWrapper>
  );
};

export default SignUp;
