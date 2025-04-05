// decode/src/app/(main)/courses/(course)/[coursename]/layout.tsx
"use client";

import { ReactNode, Suspense } from "react";
import { usePathname } from "next/navigation";
import { CourseContextProvider } from "@/features/course/context/CourseContext";
import { CourseSidebar } from "@/features/course/components/course-sidebar";
import { Flex } from "@/once-ui/components";
import { CourseSidebarSkeleton } from "@/features/course/components/skeletons";

interface PageContainerProps {
  children: ReactNode;
  sidebar: ReactNode;
}

const PageContainer = ({ children, sidebar }: PageContainerProps) => (
  <Flex
    style={{
      width: "100%",
      maxWidth: "1920px",
      height: "100vh",
      margin: "0 auto",
      overflow: "hidden",
    }}
  >
    <Suspense fallback={<CourseSidebarSkeleton />}>
      <div className="hidden md:block">{sidebar}</div>
    </Suspense>
    <Flex
      style={{
        flex: 1,
        height: "100vh",
        overflowY: "auto",
        background: "var(--bg-surface)",
      }}
    >
      {children}
    </Flex>
  </Flex>
);

// Course Layout wrapper component that provides the context
const CourseLayout = ({ children }: { children: ReactNode }) => {
  // Use the URL directly instead of params
  const pathname = usePathname();
  const segments = pathname.split("/");
  const coursename = segments[segments.length - 1];

  return (
    <CourseContextProvider>
      <PageContainer sidebar={<CourseSidebar coursePath={coursename} />}>
        {children}
      </PageContainer>
    </CourseContextProvider>
  );
};

export default CourseLayout;
