"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const ErrorCheck = () => {
  const params = useSearchParams();
  const error = params.get("error");
  return (
    <div className="flex flex-col wrapper-page items-center justify-center min-h-screen bg-destructive">
      <h1 className="text-4xl font-bold text-foreground">{error}</h1>
      <Link href="/auth/signin">
        <Button variant={"destructive"} className="rounded-20">
          Back to Login
        </Button>
      </Link>
    </div>
  );
};

const ErrorPage = () => {
  return (
    <Suspense>
      <ErrorCheck />
    </Suspense>
  );
};

export default ErrorPage;
