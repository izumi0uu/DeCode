"use client";

import React, { Suspense } from "react";
import {
  BannerCarousel,
  AnimateLessonsBoxes,
  AnimatePopularBoxes,
} from "@/features/home-and-course-preview/components";
import { useCoursesAndLessonsForPreview } from "@/features/home-and-course-preview/api/use-get-courses-lessons";
import { usePopularCourses } from "@/features/home-and-course-preview/api/use-get-courses-popular";
import { CourseCarouselProvider } from "@/features/home-and-course-preview/context/courseCarouselContext";
import { LessonBoxesProvider } from "@/features/home-and-course-preview/context/lessonBoxesContext";
import { Footer } from "@/components";
import Loading from "../../loading";

export default function Page() {
  // 数据获取集中在Page组件
  const { data: coursesData, isLoading: coursesLoading } =
    useCoursesAndLessonsForPreview();
  const { data: popularCoursesData, isLoading: popularCoursesLoading } =
    usePopularCourses();

  // 页面级加载状态
  if (coursesLoading || popularCoursesLoading) {
    return <Loading />;
  }

  return (
    <>
      {/* 热门课程部分 */}
      <CourseCarouselProvider courses={popularCoursesData || []}>
        <BannerCarousel>
          <AnimatePopularBoxes />
        </BannerCarousel>
      </CourseCarouselProvider>

      {/* 课程和课时部分  */}
      <LessonBoxesProvider
        coursesData={coursesData?.courses || []}
        lessonsData={coursesData?.lessons || []}
        initialTag="All"
      >
        <AnimateLessonsBoxes />
      </LessonBoxesProvider>

      <Footer />
    </>
  );
}
