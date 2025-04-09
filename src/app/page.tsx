// src/app/page.tsx
import { Suspense } from "react";
import HomePageClient from "@/components/layout/home-page-client";
import { getCoursesAndLessonsForPreview } from "@/features/home-and-course-preview/api/server";
import { HomePageSkeleton } from "@/components/ui/skeletons";

// 数据提供组件
async function HomeDataProvider() {
  const coursesData = await getCoursesAndLessonsForPreview();
  return <HomePageClient coursesData={coursesData} />;
}

export default async function Home() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeDataProvider />
    </Suspense>
  );
}
