"use client";

import React, { useEffect, useState } from "react";
import { Flex, Text, Skeleton } from "@/once-ui/components";
import { useCoursesAndLessonsForPreview } from "@/features/home-and-course-preview/api/use-get-courses-lessons";
import { Course } from "@/features/types/api/course";
import { LessonLight } from "@/features/types/api/lesson";
import { usePathname } from "next/navigation";

export default function LessonPage() {
  // Use the URL directly
  const pathname = usePathname();
  const segments = pathname.split("/");
  // Get coursename and lessonname from URL segments
  const coursename = segments[segments.length - 2];
  const lessonname = segments[segments.length - 1];

  const { data, isLoading, isError } = useCoursesAndLessonsForPreview();
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<LessonLight | null>(null);

  useEffect(() => {
    if (data && coursename && lessonname) {
      // Find the current course
      const currentCourse = data.courses.find(
        (c) => c.slug === coursename || c.id.toString() === coursename
      );

      if (currentCourse) {
        setCourse(currentCourse);

        // Find the current lesson
        const currentLesson = data.lessons.find(
          (l) =>
            (l.slug === lessonname || l.id.toString() === lessonname) &&
            l.course?.id === currentCourse.id
        );

        if (currentLesson) {
          setLesson(currentLesson);
        }
      }
    }
  }, [data, coursename, lessonname]);

  if (isLoading) {
    return (
      <Flex direction="column" padding="xl" gap="l">
        <Skeleton shape="block" style={{ height: "40px", width: "60%" }} />
        <Skeleton shape="block" style={{ height: "24px", width: "40%" }} />
        <Skeleton shape="block" style={{ height: "300px", width: "100%" }} />
        <Skeleton shape="block" style={{ height: "200px", width: "100%" }} />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex
        direction="column"
        padding="xl"
        style={{
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
        }}
      >
        <Text variant="heading-strong-l" color="error">
          Error loading lesson
        </Text>
        <Text
          variant="body-default-m"
          color="light"
          style={{ marginTop: "16px" }}
        >
          There was a problem loading this lesson. Please try again later.
        </Text>
      </Flex>
    );
  }

  if (!course || !lesson) {
    return (
      <Flex
        direction="column"
        padding="xl"
        style={{
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
        }}
      >
        <Text variant="heading-strong-l" color="light">
          Lesson not found
        </Text>
        <Text
          variant="body-default-m"
          color="light"
          style={{ marginTop: "16px" }}
        >
          The requested lesson could not be found.
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" padding="xl">
      <Flex direction="column" gap="s" style={{ marginBottom: "32px" }}>
        <Text variant="heading-strong-l" color="light">
          {lesson.title}
        </Text>
        {lesson.description && (
          <Text variant="body-default-m" color="light" style={{ opacity: 0.8 }}>
            {lesson.description}
          </Text>
        )}
        <Flex gap="m" style={{ marginTop: "16px" }}>
          {lesson.duration && (
            <Text
              variant="body-default-s"
              color="light"
              style={{ opacity: 0.6 }}
            >
              Duration: {lesson.duration} min
            </Text>
          )}
          {lesson.type && (
            <Text
              variant="body-default-s"
              color="light"
              style={{ opacity: 0.6 }}
            >
              Type: {lesson.type}
            </Text>
          )}
        </Flex>
      </Flex>

      {/* Lesson Content Placeholder */}
      <Flex
        direction="column"
        style={{
          padding: "24px",
          borderRadius: "12px",
          background: "rgba(51, 102, 255, 0.05)",
          border: "1px solid rgba(51, 102, 255, 0.2)",
        }}
      >
        <Text variant="body-default-m" color="light">
          This is where the lesson content would be displayed. In a real
          application, this would be populated with rich text content,
          interactive elements, videos, code samples, and other educational
          materials.
        </Text>
      </Flex>
    </Flex>
  );
}
