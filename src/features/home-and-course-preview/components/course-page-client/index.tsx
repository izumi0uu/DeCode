"use client";

import React from "react";
import {
  BannerCarousel,
  AnimateLessonsBoxes,
  AnimatePopularBoxes,
} from "@/features/home-and-course-preview/components";
import { CourseCarouselProvider } from "@/features/home-and-course-preview/context/courseCarouselContext";
import { LessonBoxesProvider } from "@/features/home-and-course-preview/context/lessonBoxesContext";
import { Footer } from "@/components";

interface CoursePageClientProps {
  coursesData: any; // 使用适当的类型
  popularCoursesData: any; // 使用适当的类型
}

const CoursePageClient = ({
  coursesData,
  popularCoursesData,
}: CoursePageClientProps) => {
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
};

export default CoursePageClient;
