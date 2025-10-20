"use client";

import { ConversationProvider } from "@/contexts/ConversationContext";
import React, { ReactNode } from "react";

const ConversationProviderWrapper = ({ children }: { children: ReactNode }) => {
  return <ConversationProvider>{children}</ConversationProvider>;
};

export default ConversationProviderWrapper;
