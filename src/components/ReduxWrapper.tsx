"use client";

import { store } from "@/redux-toolkit/store";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";

const ReduxWrapper = ({ children }: { children: ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxWrapper;
