"use client";

import { SocketProvider } from "@/contexts/SocketContext";
import React, { ReactNode } from "react";

const SocketWrapper = ({ children }: { children: ReactNode }) => {
  return <SocketProvider>{children}</SocketProvider>;
};

export default SocketWrapper;
