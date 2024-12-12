"use client";
import verifyEmail from "@/app/actions/verifyEmail";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const Page = () => {
  const [loading, setLoading] = useState<boolean | undefined>();
  const [message, setMessage] = useState<string | undefined>();
  const params = useSearchParams();
  const token = params.get("token");

  const newVerifyEmail = useCallback(
    (token: string) => {
      if (!token) return;
      setLoading(true);
      verifyEmail(token).then((data) => {
        if (data) {
          setLoading(false);
          setMessage(data.message);
        }
      });
    },
    [token]
  );

  useEffect(() => {
    newVerifyEmail(token);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      {loading && <h1>LOADING..</h1>}
      {message && <h1>{message}</h1>}
    </div>
  );
};

export default Page;
