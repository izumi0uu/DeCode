import { LessonsBoxesSkeleton } from "@/features/home-and-course-preview/components/skeletons/lesson-boxes-skeleton";
import { HomeHeroSkeleton } from "../home-hero-skeleton";
export const HomePageSkeleton = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <HomeHeroSkeleton />
      <LessonsBoxesSkeleton />
    </div>
  );
};
