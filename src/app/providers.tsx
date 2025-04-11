"use client";

import { ToastProvider } from "@/once-ui/components/ToastProvider";
import { TanstackContextProvider } from "@/features/contexts/tanstack-context";
import { Web3AuthProvider } from "@/contexts/web3auth-context";
import { ReactNode } from "react";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <TanstackContextProvider>
      <ToastProvider>
        <Web3AuthProvider>{children}</Web3AuthProvider>
      </ToastProvider>
    </TanstackContextProvider>
  );
};
