"use client";
import { signIn, useSession } from "next-auth/react";
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-center">Sign In</h1>
        <button
          onClick={() => signIn("google")}
          className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;
