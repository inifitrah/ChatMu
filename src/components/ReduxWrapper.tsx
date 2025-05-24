"use client";

import { store } from "@/redux-toolkit/store";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import ConversationProviderWrapper from "./ConversationProviderWrapper";

const ReduxWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <ConversationProviderWrapper>{children}</ConversationProviderWrapper>
    </Provider>
  );
};

export default ReduxWrapper;
