import React from "react";
import { Flex } from "@/once-ui/components";
// import { CoursePageSkeleton } from "@/features/home-and-course-preview/components/skeletons/course-page-skeleton";

export default function CoursesLoading() {
  return (
    <Flex
      direction="column"
      style={{
        width: "100%",
        minHeight: "90vh",
      }}
    >
      {/* <CoursePageSkeleton /> */}
    </Flex>
  );
}
