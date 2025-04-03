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
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  const { data: popularCoursesData, isLoading: popularCoursesLoading } =
    usePopularCourses();

  const { data: coursesData, isLoading: coursesLoading } =
    useCoursesAndLessonsForPreview();

  // 从课程数据中提取标签
  useEffect(() => {
    if (coursesData) {
      const tags = new Set<string>();
      tags.add("All");

      // 仅从常规课程中提取标签
      coursesData.courses.forEach((course) => {
        if (course.tags && Array.isArray(course.tags)) {
          course.tags.forEach((tag) => {
            if (tag && tag.name) {
              tags.add(tag.name);
            }
          });
        }
      });

      setTagList(Array.from(tags));
    }
  }, [coursesData]);

  useEffect(() => {
    console.log(tagList);
  }, [tagList]);

  useEffect(() => {
    console.log(coursesData);
  }, [coursesData]);

  // 设置热门课程数据
  useEffect(() => {
    if (popularCoursesData) {
      setPopularCourses(popularCoursesData);
    }
  }, [popularCoursesData]);

  // 设置常规课程数据
  useEffect(() => {
    if (coursesData) {
      setCourses(coursesData.courses);
      setFilteredCourses(coursesData.courses);
    }
  }, [coursesData]);

  // 根据当前选中的标签筛选课程
  useEffect(() => {
    if (currentTag === "All") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(
        (course) =>
          course.tags &&
          Array.isArray(course.tags) &&
          course.tags.some((tag) => tag && tag.name === currentTag)
      );

      setFilteredCourses(filtered);
    }
  }, [currentTag, courses]);

  // 标签选择处理函数
  const handleTagSelect = (tag: string) => {
    setCurrentTag(tag);
  };

  return (
    <>
      <CourseCarouselProvider courses={popularCourses}>
        <BannerCarousel>
          <AnimatePopularBoxes />
        </BannerCarousel>
      </CourseCarouselProvider>
      <CourseCarouselProvider courses={filteredCourses}>
        <AnimateCoursesBoxes
          tagList={tagList}
          currentTag={currentTag}
          onTagSelect={handleTagSelect}
        />
      </CourseCarouselProvider>
    </>
  );
}
