"use client";

import React, { useEffect, useState } from "react";
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
  const [categoryList, setCategoryList] = useState<string[]>(["All"]);
  const [currentCategory, setCurrentCategory] = useState<string>("All");

  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  const { data: popularCoursesData, isLoading: popularCoursesLoading } =
    usePopularCourses();

  const { data: coursesData, isLoading: coursesLoading } =
    useCoursesAndLessonsForPreview();

  // 从课程数据中提取分类
  useEffect(() => {
    if (coursesData) {
      const categories = new Set<string>();
      categories.add("All");

      // 从课程中提取分类标签
      coursesData.courses.forEach((course) => {
        // 优先使用 shortTitleTag
        if (course.shortTitleTag) {
          categories.add(course.shortTitleTag);
        }
        // 其次使用 category name
        else if (course.category?.name) {
          categories.add(course.category.name);
        }
        // 最后使用标题的简化版本
        else {
          const shortTitle = course.title.split(" ").slice(0, 2).join(" ");
          categories.add(shortTitle);
        }
      });

      setCategoryList(Array.from(categories));
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
      setFilteredCourses(coursesData.courses);
    }
  }, [coursesData]);

  // 根据当前选中的分类筛选课程
  useEffect(() => {
    if (currentCategory === "All") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter((course) => {
        // 优先匹配 shortTitleTag
        if (course.shortTitleTag === currentCategory) {
          return true;
        }
        // 其次匹配 category name
        if (course.category?.name === currentCategory) {
          return true;
        }
        // 最后匹配标题的简化版本
        const shortTitle = course.title.split(" ").slice(0, 2).join(" ");
        return shortTitle === currentCategory;
      });

      setFilteredCourses(filtered);
    }
  }, [currentCategory, courses]);

  // 分类选择处理函数
  const handleCategorySelect = (category: string) => {
    setCurrentCategory(category);
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

      {/* lesson展示区 */}
      <AnimateLessonsBoxes
        tagList={categoryList}
        currentTag={currentCategory}
        onTagSelect={handleCategorySelect}
      />
      <Footer />
    </>
  );
}
