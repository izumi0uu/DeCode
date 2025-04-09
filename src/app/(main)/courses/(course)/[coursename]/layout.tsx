// src/app/(main)/courses/(course)/[coursename]/layout.tsx
import { ReactNode, Suspense } from "react";
import { getPopularCourses } from "@/features/home-and-course-preview/api/server";
import { CourseSidebarClient } from "@/features/course/components/coursename-sidebar-client";
import { CoursePageContainer } from "@/features/course/components/coursename-page-container";
import {
  CourseSidebarSkeleton,
  CourseDetailSkeleton,
} from "@/features/course/components/skeletons";

// 服务端数据获取
async function CourseLayout({
  children,
  params: { coursename },
}: {
  children: ReactNode;
  params: { coursename: string };
}) {
  // 服务端获取课程数据
  const coursesData = await getPopularCourses();

  return (
    <Suspense
      fallback={
        <CoursePageContainer
          sidebar={<CourseSidebarSkeleton />}
          children={<CourseDetailSkeleton />}
        />
      }
    >
      <CoursePageContainer
        sidebar={
          <Suspense fallback={<CourseSidebarSkeleton />}>
            <CourseSidebarClient
              courses={coursesData}
              coursePath={coursename}
            />
          </Suspense>
        }
      >
        <Suspense fallback={<CourseDetailSkeleton />}>{children}</Suspense>
      </CoursePageContainer>
    </Suspense>
  );
}

export default CourseLayout;
