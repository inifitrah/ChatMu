"use client";

import { SessionProvider } from "next-auth/react";

const SessionWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <SessionProvider refetchOnWindowFocus={false}>{children}</SessionProvider>
  );
};

export default SessionWrapper;
