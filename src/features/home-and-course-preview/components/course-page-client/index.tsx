// src/features/home-and-course-preview/components/courses-page-client/index.tsx
"use client";

import React, { Suspense } from "react";
import { Flex } from "@/once-ui/components";
import {
  BannerCarousel,
  AnimateLessonsBoxes,
  AnimatePopularBoxes,
} from "@/features/home-and-course-preview/components";
import { CourseCarouselProvider } from "@/features/home-and-course-preview/context/courseCarouselContext";
import { LessonBoxesProvider } from "@/features/home-and-course-preview/context/lessonBoxesContext";
import {
  CoursePopularCardSkeletons,
  LessonsBoxesSkeleton,
} from "@/features/home-and-course-preview/components/skeletons";
import { Footer } from "@/components";

interface CoursesPageClientProps {
  coursesData: any;
  popularCoursesData: any;
}

export function CoursesPageClient({
  coursesData,
  popularCoursesData,
}: CoursesPageClientProps) {
  return (
    <Flex direction="column" className="courses-page-client">
      {/* 热门课程部分：独立Suspense区域 */}
      <Suspense
        fallback={
          <Flex
            className="banner-carousel-skeleton"
            style={{ height: "500px" }}
          >
            <CoursePopularCardSkeletons count={2} />
          </Flex>
        }
      >
        <CourseCarouselProvider courses={popularCoursesData || []}>
          <BannerCarousel>
            <AnimatePopularBoxes />
          </BannerCarousel>
        </CourseCarouselProvider>
      </Suspense>

      {/* 课程和课时部分：独立Suspense区域 */}
      <Suspense fallback={<LessonsBoxesSkeleton />}>
        <LessonBoxesProvider
          coursesData={coursesData?.courses || []}
          lessonsData={coursesData?.lessons || []}
          initialTag="All"
        >
          <AnimateLessonsBoxes />
        </LessonBoxesProvider>
      </Suspense>

      <Footer />
    </Flex>
  );
}
