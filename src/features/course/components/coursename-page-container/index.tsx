"use client";

import { ReactNode } from "react";
import { Flex } from "@/once-ui/components";
import { CourseContextProvider } from "@/features/course/context/CourseContext";

interface CoursePageContainerProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export function CoursePageContainer({
  children,
  sidebar,
}: CoursePageContainerProps) {
  return (
    <CourseContextProvider>
      <Flex
        style={{
          width: "100%",
          maxWidth: "1920px",
          height: "100vh",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        <div className="hidden md:block">{sidebar}</div>

        <Flex
          style={{
            flex: 1,
            flexGrow: 1,
            height: "100vh",
            overflowY: "auto",
            background: "var(--bg-surface)",
          }}
        >
          {children}
        </Flex>
      </Flex>
    </CourseContextProvider>
  );
}
