"use client";
import { verifyEmail } from "@/app/actions/newVerificationActions";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useState } from "react";

const VerifyToken = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const params = useSearchParams();
  const token = params.get("token");

  const newVerifyEmail = useCallback(
    (token: string | null) => {
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
    [token]
  );

  useEffect(() => {
    newVerifyEmail(token);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      {!success && !error && <h1>LOADING..</h1>}
      {success && <h1>{success}</h1>}
      {!success && error && <h1 className="text-red-500">{error}</h1>}
    </div>
  );
};

const VerifyPage = () => {
  return (
    <Suspense>
      <VerifyToken />
    </Suspense>
  );
};

export default VerifyPage;
