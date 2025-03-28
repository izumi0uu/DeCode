"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Flex } from "@/once-ui/components";
import {
  BannerCarousel,
  AnimatePresenceBoxes,
} from "@/features/home-and-course-preview/components";
import { CourseDetail } from "@/features/types/course";
import { usePopularCourses } from "@/features/home-and-course-preview/api/use-get-courses-popular";
import {
  useCourses,
  useCoursesAndLessons,
} from "@/features/home-and-course-preview/api/use-get-courses-lessons";

export default function Page({ params }: { params: { locale: string } }) {
  const [tagList, setTagList] = useState<string[]>(["All"]);
  const [currentTag, setCurrentTag] = useState<string>("All");

  const [filteredPopularCourses, setFilteredPopularCourses] = useState<
    CourseDetail[]
  >([]);

  const [popularCourses, setPopularCourses] = useState<CourseDetail[]>([]);
  const [courses, setCourses] = useState<CourseDetail[]>([]);

  const { data: popularCoursesData, isLoading: popularCoursesLoading } =
    usePopularCourses();
  const { data: coursesData, isLoading: coursesLoading } =
    useCoursesAndLessons();

  useEffect(() => {
    console.log(coursesData);
  }, [coursesData]);

  return (
    <Flex>
      <BannerCarousel>
        <AnimatePresenceBoxes popularCourses={popularCourses} />
      </BannerCarousel>
    </Flex>
  );
}
