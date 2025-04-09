"use client";

import React from "react";
import { Flex } from "@/once-ui/components";
import { CoursePopularCardSkeletons } from "../course-popular-card-skeleton";
import { LessonsBoxesSkeleton } from "../lesson-boxes-skeleton";

export function CoursesPageSkeleton() {
  return (
    <Flex direction="column" className="courses-page-skeleton">
      {/* 热门课程骨架屏 */}
      <Flex
        className="banner-carousel-skeleton"
        style={{
          height: "500px",
          background: "rgba(0,0,0,0.05)",
          position: "relative",
        }}
      >
        <CoursePopularCardSkeletons count={2} />
      </Flex>

      {/* 课程列表骨架屏 */}
      <LessonsBoxesSkeleton />
    </Flex>
  );
}
