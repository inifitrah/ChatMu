"use client";
import { verifyEmail } from "@/app/actions/newVerificationActions";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const VerifyPage = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const params = useSearchParams();
  const token = params.get("token");

  const newVerifyEmail = useCallback(
    (token: string) => {
      if (!token) return;
      if (success || error) return;
      verifyEmail(token)
        .then((data) => {
          if (data.success) {
            setSuccess(data.message);
            return;
          }
          if (!data.success) {
            setError(data.message);
            return;
          }
        })
        .catch((err) => {
          console.log(err);
          setError("Verification failed. Please try again.");
        });
    },
    [success, error]
  );

  useEffect(() => {
    if (token) {
      newVerifyEmail(token);
    }
  }, [newVerifyEmail, token]);

  return (
    <div className="flex justify-center items-center h-screen">
      {!success && !error && <h1>LOADING..</h1>}
      {success && <h1>{success}</h1>}
      {!success && error && <h1 className="text-red-500">{error}</h1>}
    </div>
  );
};

export default VerifyPage;
