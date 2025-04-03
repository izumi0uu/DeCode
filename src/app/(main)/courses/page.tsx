"use client";

import React, { useEffect, useState } from "react";
import {
  BannerCarousel,
  AnimateCoursesBoxes,
  AnimatePopularBoxes,
} from "@/features/home-and-course-preview/components";
import { Course } from "@/features/types/api/course";
import { useCoursesAndLessonsForPreview } from "@/features/home-and-course-preview/api/use-get-courses-lessons";
import { usePopularCourses } from "@/features/home-and-course-preview/api/use-get-courses-popular";
import { CourseCarouselProvider } from "@/features/home-and-course-preview/context/courseCarouselContext";

export default function Page({ params }: { params: { locale: string } }) {
  const [tagList, setTagList] = useState<string[]>(["All"]);
  const [currentTag, setCurrentTag] = useState<string>("All");

  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const { data: popularCoursesData, isLoading: popularCoursesLoading } =
    usePopularCourses();

  const { data: coursesData, isLoading: coursesLoading } =
    useCoursesAndLessonsForPreview();

  useEffect(() => {
    if (popularCoursesData) {
      setPopularCourses(popularCoursesData);
    }
  }, [popularCoursesData]);

  useEffect(() => {
    if (coursesData) {
      setCourses(coursesData.courses);
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
