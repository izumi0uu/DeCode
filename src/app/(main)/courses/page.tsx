"use client";

import React, { use, useEffect, useState } from "react";
import { Flex } from "@/once-ui/components";
import {
  BannerCarousel,
  AnimatePresenceBoxes,
} from "@/features/home-and-course-preview/components";
import { Course } from "@/features/types/api/course";
import { usePopularCourses } from "@/features/home-and-course-preview/api/use-get-courses-popular";
import { CourseCarouselProvider } from "@/features/home-and-course-preview/context/courseCarouselContext";

export default function Page({ params }: { params: { locale: string } }) {
  const [tagList, setTagList] = useState<string[]>(["All"]);
  const [currentTag, setCurrentTag] = useState<string>("All");

  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const { data: popularCoursesData, isLoading: popularCoursesLoading } =
    usePopularCourses();

  useEffect(() => {
    if (popularCoursesData) {
      // 从 CourseListResponse 转换为 Course[]
      setPopularCourses(popularCoursesData.data);
    }
  }, [popularCoursesData]);

  return (
    <CourseCarouselProvider courses={popularCourses}>
      <BannerCarousel>
        <AnimatePresenceBoxes />
      </BannerCarousel>
    </CourseCarouselProvider>
  );
}
