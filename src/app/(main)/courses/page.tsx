// src/app/(main)/courses/page.tsx
import React, { Suspense } from "react";
import {
  getCoursesAndLessonsForPreview,
  getPopularCourses,
} from "@/features/home-and-course-preview/api/server";
import { CoursesPageClient } from "@/features/home-and-course-preview/components/course-page-client";
import { CoursesPageSkeleton } from "@/features/home-and-course-preview/components/skeletons";

// 数据提供器组件：负责数据获取
async function DataProvider() {
  // 并行数据获取，提高性能
  const [coursesData, popularCoursesData] = await Promise.all([
    getCoursesAndLessonsForPreview(),
    getPopularCourses().catch(() => []), // 错误处理
  ]);

  return (
    <CoursesPageClient
      coursesData={coursesData}
      popularCoursesData={popularCoursesData}
    />
  );
}

// 页面组件
export default async function CoursesPage() {
  return (
    // <Suspense fallback={<CoursesPageSkeleton />}>
    //   <DataProvider />
    // </Suspense>
    <CoursesPageSkeleton />
  );
}
