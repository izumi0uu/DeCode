"use client";

import { ToastProvider } from "@/once-ui/components/ToastProvider";
import { TanstackContextProvider } from "@/features/contexts/tanstack-context";
import { ReactNode } from "react";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <TanstackContextProvider>
      <ToastProvider>{children}</ToastProvider>
    </TanstackContextProvider>
  );
};
