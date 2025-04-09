import React, { Suspense } from "react";
import {
  getCoursesAndLessonsForPreview,
  getPopularCourses,
} from "@/features/home-and-course-preview/api/server";
import CoursePageClient from "@/features/home-and-course-preview/components/course-page-client";

// 服务端数据获取
const coursesData = await getCoursesAndLessonsForPreview();
const popularCoursesData = await getPopularCourses();

export default async function CoursesPage() {
  // 将数据传递给客户端组件
  return (
    <CoursePageClient
      coursesData={coursesData}
      popularCoursesData={popularCoursesData}
    />
  );
}
