import React from "react";
import { getCoursesAndLessonsForPreview } from "@/features/home-and-course-preview/api/server";
import { CoursePageClient } from "@/features/course/components";
import { Course } from "@/features/types";

const coursesData = await getCoursesAndLessonsForPreview();

export default async function CoursePage({
  params,
}: {
  params: { coursename: string };
}) {
  try {
    const { coursename } = params;

    // 找到当前课程
    const currentCourse = coursesData.courses.find(
      (c: Course) => c.slug === coursename || c.id.toString() === coursename
    );

    // 找到当前课程的所有课时
    const courseLessons = coursesData.lessons.filter(
      (l) => l.course?.id === currentCourse.id
    );

    return (
      <CoursePageClient
        course={currentCourse}
        lessons={courseLessons}
        coursename={coursename}
      />
    );
  } catch (error) {
    throw new Error(
      "There was a problem loading this course. Please try again later."
    );
  }
}
