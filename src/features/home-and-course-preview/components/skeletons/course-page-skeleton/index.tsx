"use client";

import React from "react";
import { Flex } from "@/once-ui/components";
import { CoursePopularCardSkeletons } from "../course-popular-card-skeleton";
import { LessonsBoxesSkeleton } from "../lesson-boxes-skeleton";

export function CoursesPageSkeleton() {
  return (
    <Flex direction="column">
      {/* 热门课程骨架屏 */}
      <Flex
        style={{
          background: "rgba(0,0,0,0.05)",
          position: "relative",
          height: "fit-content",
        }}
      >
        <CoursePopularCardSkeletons count={1} />
      </Flex>

      {/* 课程列表骨架屏 */}
      <LessonsBoxesSkeleton />
    </Flex>
  );
}
