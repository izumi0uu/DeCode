"use client";

import React from "react";
import { Flex, Text, Button } from "@/once-ui/components";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Course } from "@/features/types/api/course";
import { LessonLight } from "@/features/types/api/lesson";
import { useCoursesAndLessonsForPreview } from "@/features/home-and-course-preview/api/use-get-courses-lessons";

// Course header component
const LessonHeader = ({
  title,
  description,
  duration,
  type,
}: {
  title: string;
  description?: string;
  duration?: number;
  type?: string;
}) => {
  return (
    <Flex direction="column" gap="s" style={{ marginBottom: "32px" }}>
      <Text variant="heading-strong-l" color="light">
        {title}
      </Text>
      {description && (
        <Text variant="body-default-m" color="light" style={{ opacity: 0.8 }}>
          {description}
        </Text>
      )}
      <Flex gap="m" style={{ marginTop: "16px" }}>
        {duration && (
          <Text variant="body-default-s" color="light" style={{ opacity: 0.6 }}>
            Duration: {duration} min
          </Text>
        )}
        {type && (
          <Text variant="body-default-s" color="light" style={{ opacity: 0.6 }}>
            Type: {type}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

// Lesson content component
const LessonContent = ({ content }: { content?: string }) => {
  return (
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
        {content ||
          "This is where the lesson content would be displayed. In a real application, this would be populated with rich text content, interactive elements, videos, code samples, and other educational materials."}
      </Text>
    </Flex>
  );
};

// Navigation component
const LessonNavigation = ({
  courseName,
  prevLesson,
  nextLesson,
}: {
  courseName: string;
  prevLesson?: { slug: string; title: string };
  nextLesson?: { slug: string; title: string };
}) => {
  return (
    <Flex
      style={{
        marginTop: "48px",
        padding: "24px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {prevLesson ? (
        <Link href={`/courses/${courseName}/${prevLesson.slug}`} passHref>
          <Button variant="secondary">Previous: {prevLesson.title}</Button>
        </Link>
      ) : (
        <div></div>
      )}

      {nextLesson && (
        <Link href={`/courses/${courseName}/${nextLesson.slug}`} passHref>
          <Button variant="primary">Next: {nextLesson.title}</Button>
        </Link>
      )}
    </Flex>
  );
};

export default function LessonPage() {
  // Get path parameters
  const pathname = usePathname();
  const segments = pathname.split("/");
  const coursename = segments[segments.length - 2];
  const lessonname = segments[segments.length - 1];

  // 获取课程和章节数据
  const {
    data: coursesData,
    isLoading,
    isError,
  } = useCoursesAndLessonsForPreview();

  // 处理加载状态 - 这应该由 loading.tsx 处理
  if (isLoading) {
    return null; // 返回null让Next.js使用loading.tsx
  }

  // 处理错误状态 - 这应该由 error.tsx 处理
  if (isError || !coursesData) {
    throw new Error("Failed to load course data");
  }

  // Find current course
  const currentCourse = coursesData.courses.find(
    (c) => c.slug === coursename || c.id.toString() === coursename
  );

  if (!currentCourse) {
    // This will trigger error.tsx
    throw new Error(`Course '${coursename}' not found`);
  }

  // Find current lesson
  const currentLesson = coursesData.lessons.find(
    (l) =>
      (l.slug === lessonname || l.id.toString() === lessonname) &&
      l.course?.id === currentCourse.id
  );

  if (!currentLesson) {
    // This will trigger error.tsx
    throw new Error(
      `Lesson '${lessonname}' not found in course '${coursename}'`
    );
  }

  // Find previous and next lessons
  const courseLessons = coursesData.lessons
    .filter((l) => l.course?.id === currentCourse.id)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const currentIndex = courseLessons.findIndex(
    (l) => l.id === currentLesson.id
  );
  const prevLesson =
    currentIndex > 0 ? courseLessons[currentIndex - 1] : undefined;
  const nextLesson =
    currentIndex >= 0 && currentIndex < courseLessons.length - 1
      ? courseLessons[currentIndex + 1]
      : undefined;

  return (
    <Flex direction="column" padding="xl">
      <LessonHeader
        title={currentLesson.title}
        description={currentLesson.description}
        duration={currentLesson.duration}
        type={currentLesson.type}
      />

      <LessonContent content="This is where the lesson content would be displayed. In a real application, this would be populated with rich text content, interactive elements, videos, code samples, and other educational materials." />

      <hr
        style={{
          margin: "32px 0 16px",
          border: "none",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      />

      <LessonNavigation
        courseName={currentCourse.slug || currentCourse.id.toString()}
        prevLesson={
          prevLesson
            ? {
                slug: prevLesson.slug || prevLesson.id.toString(),
                title: prevLesson.title,
              }
            : undefined
        }
        nextLesson={
          nextLesson
            ? {
                slug: nextLesson.slug || nextLesson.id.toString(),
                title: nextLesson.title,
              }
            : undefined
        }
      />
    </Flex>
  );
}
