"use client";

import React, { Suspense } from "react";
import { Flex } from "@/once-ui/components";
import LessonLoading from "./loading";

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex
      className="lesson-layout"
      direction="column"
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "var(--color-background-base)",
      }}
    >
      <Suspense fallback={<LessonLoading />}>{children}</Suspense>
    </Flex>
  );
}
