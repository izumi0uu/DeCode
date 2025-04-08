"use client";

import React, { Suspense, useEffect, useState } from "react";
import {
  BannerCarousel,
  AnimateLessonsBoxes,
  AnimatePopularBoxes,
} from "@/features/home-and-course-preview/components";
import { Course } from "@/features/types/api/course";
import { useCoursesAndLessonsForPreview } from "@/features/home-and-course-preview/api/use-get-courses-lessons";
import { usePopularCourses } from "@/features/home-and-course-preview/api/use-get-courses-popular";
import { CourseCarouselProvider } from "@/features/home-and-course-preview/context/courseCarouselContext";
import { Footer } from "@/components";

import Loading from "../../loading";

export default function Page({ params }: { params: { locale: string } }) {
  const [tagList, setTagList] = useState<string[]>(["All"]);
  const [currentTag, setCurrentTag] = useState<string>("All");

  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const { data: popularCoursesData, isLoading: popularCoursesLoading } =
    usePopularCourses();

  const { data: coursesData, isLoading: coursesLoading } =
    useCoursesAndLessonsForPreview();

  // 从课程数据中提取分类
  useEffect(() => {
    if (coursesData) {
      const tags = new Set<string>();
      tags.add("All");

      // 从课程中提取分类标签
      coursesData.courses.forEach((course) => {
        // 优先使用 shortTitleTag
        if (course.shortTitleTag) {
          tags.add(course.shortTitleTag);
        }
        // 其次使用 category name
        else if (course.category?.name) {
          tags.add(course.category.name);
        }
        // 最后使用标题的简化版本
        else {
          const shortTitle = course.title.split(" ").slice(0, 2).join(" ");
          tags.add(shortTitle);
        }
      });

      setTagList(Array.from(tags));
    }
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
    }
  }, [coursesData]);

  // 分类选择处理函数
  const handleTagSelect = (tag: string) => {
    setCurrentTag(tag);
  };

  // nextjs特性 客户端page不能自动继承父组件的loading
  if (coursesLoading || popularCoursesLoading) {
    return <Loading />;
  }

  return (
    <>
      <CourseCarouselProvider courses={popularCourses}>
        <BannerCarousel>
          <AnimatePopularBoxes />
        </BannerCarousel>
      </CourseCarouselProvider>

      <AnimateLessonsBoxes
        tagList={tagList}
        currentTag={currentTag}
        onTagSelect={handleTagSelect}
      />
      <Footer />
    </>
  );
}
