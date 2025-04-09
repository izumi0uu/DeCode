import { Suspense } from "react";
import HomePageClient from "@/components/layout/homePageClient";
import { getCoursesAndLessonsForPreview } from "@/features/home-and-course-preview/api/server";

export default async function Home() {
  // 服务端数据获取
  const coursesData = await getCoursesAndLessonsForPreview();

  return (
    <Suspense fallback={<div style={{ height: "100vh" }}></div>}>
      <HomePageClient coursesData={coursesData} />
    </Suspense>
  );
}
