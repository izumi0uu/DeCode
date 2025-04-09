import HomePageClient from "@/components/layout/homePageClient";
import { getCoursesAndLessonsForPreview } from "@/features/home-and-course-preview/api/server";

const coursesData = await getCoursesAndLessonsForPreview();

export default async function Home() {
  return <HomePageClient coursesData={coursesData} />;
}
