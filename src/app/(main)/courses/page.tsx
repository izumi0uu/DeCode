"use client";

import React, { use, useEffect, useState } from "react";
import { Flex } from "@/once-ui/components";
import {
  BannerCarousel,
  AnimateCoursesBoxes,
  AnimatePopularBoxes,
} from "@/features/home-and-course-preview/components";
import { Course } from "@/features/types/api/course";
import { useCourses } from "@/features/home-and-course-preview/api/use-get-courses-lessons";
import { usePopularCourses } from "@/features/home-and-course-preview/api/use-get-courses-popular";
import { CourseCarouselProvider } from "@/features/home-and-course-preview/context/courseCarouselContext";

export default function Page({ params }: { params: { locale: string } }) {
  const [tagList, setTagList] = useState<string[]>(["All"]);
  const [currentTag, setCurrentTag] = useState<string>("All");

  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const { data: popularCoursesData, isLoading: popularCoursesLoading } =
    usePopularCourses();

  const { data: coursesData, isLoading: coursesLoading } = useCourses();

  useEffect(() => {
    if (popularCoursesData) {
      // 从 CourseListResponse 转换为 Course[]
      setPopularCourses(popularCoursesData.data);
    }
  }, [popularCoursesData]);

  useEffect(() => {
    if (coursesData) {
      // 从 CourseListResponse 转换为 Course[]
      setCourses(coursesData.data);
    }
  }, [coursesData]);

  return (
    <>
      <CourseCarouselProvider courses={popularCourses}>
        <BannerCarousel>
          <AnimatePopularBoxes />
        </BannerCarousel>
      </CourseCarouselProvider>
      <CourseCarouselProvider courses={courses}>
        <AnimateCoursesBoxes />
      </CourseCarouselProvider>
    </>
  );
}
