import React, { createContext, useState, useContext, ReactNode } from "react";
import { Course } from "@/features/types/api/course";

interface CourseCarouselContextType {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  courses: Course[];
  currentCourse: Course | undefined;
  nextCourse: Course | undefined;
}

const CourseCarouselContext = createContext<
  CourseCarouselContextType | undefined
>(undefined);

export const CourseCarouselProvider = ({
  children,
  courses = [],
}: {
  children: ReactNode;
  courses: Course[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 循环索引处理
  const safeSetIndex = (newIndex: number) => {
    if (courses.length === 0) return;
    // 确保索引在有效范围内
    const nextIndex = (newIndex + courses.length) % courses.length;
    setCurrentIndex(nextIndex);
  };

  const value = {
    currentIndex,
    setCurrentIndex: safeSetIndex,
    courses,
    currentCourse: courses[currentIndex],
    nextCourse: courses[(currentIndex + 1) % courses.length],
  };

  return (
    <CourseCarouselContext.Provider value={value}>
      {children}
    </CourseCarouselContext.Provider>
  );
};

export const useCourseCarousel = () => {
  const context = useContext(CourseCarouselContext);
  if (context === undefined) {
    throw new Error(
      "useCourseCarousel must be used within a CourseCarouselProvider"
    );
  }
  return context;
};
