"use client";

import React, { useEffect, useState } from "react";
import { Flex, Text, Button } from "@/once-ui/components";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCoursesAndLessonsForPreview } from "@/features/home-and-course-preview/api/use-get-courses-lessons";
import LessonLoading from "./loading";

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
  // 确保只在客户端运行
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  // 在服务端或加载中时显示加载骨架
  if (!isClient || isLoading) {
    return <LessonLoading />;
  }

  // 处理错误状态
  if (isError || !coursesData) {
    return (
      <Flex direction="column" padding="xl">
        <Text variant="heading-strong-l" color="error">
          Failed to load course data
        </Text>
        <Text
          variant="body-default-m"
          color="light"
          style={{ marginTop: "16px" }}
        >
          Please try refreshing the page.
        </Text>
      </Flex>
    );
  }

  // Find current course
  const currentCourse = coursesData.courses.find(
    (c) => c.slug === coursename || c.id.toString() === coursename
  );

  if (!currentCourse) {
    return (
      <Flex direction="column" padding="xl">
        <Text variant="heading-strong-l" color="error">
          Course not found
        </Text>
        <Text
          variant="body-default-m"
          color="light"
          style={{ marginTop: "16px" }}
        >
          The course {coursename} could not be found.
        </Text>
        <Link href="/courses" style={{ marginTop: "24px" }} passHref>
          <Button variant="primary">Browse All Courses</Button>
        </Link>
      </Flex>
    );
  }

  // Find current lesson
  const currentLesson = coursesData.lessons.find(
    (l) =>
      (l.slug === lessonname || l.id.toString() === lessonname) &&
      l.course?.id === currentCourse.id
  );

  if (!currentLesson) {
    return (
      <Flex direction="column" padding="xl">
        <Text variant="heading-strong-l" color="error">
          Lesson not found
        </Text>
        <Text
          variant="body-default-m"
          color="light"
          style={{ marginTop: "16px" }}
        >
          The lesson {lessonname} could not be found in course{" "}
          {currentCourse.title}.
        </Text>
        <Link
          href={`/courses/${currentCourse.slug || currentCourse.id}`}
          style={{ marginTop: "24px" }}
          passHref
        >
          <Button variant="primary">Back to Course</Button>
        </Link>
      </Flex>
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
