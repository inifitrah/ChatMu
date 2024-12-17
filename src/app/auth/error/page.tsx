"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const ErrorPage = () => {
  const params = useSearchParams();
  const error = params.get("error");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
      <h1 className="text-4xl font-bold text-red-600">{error}</h1>
      {/* <p className="mt-4 text-lg text-red-500"></p> */}
      <Link href="/auth/signin">
        <button className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Back to Login
        </button>
      </Link>
    </div>
  );
};

export default ErrorPage;
