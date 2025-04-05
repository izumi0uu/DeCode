"use client";

import React, { useEffect, useState } from "react";
import { Flex, Text, Skeleton, Button } from "@/once-ui/components";
import { useCoursesAndLessonsForPreview } from "@/features/home-and-course-preview/api/use-get-courses-lessons";
import { Course } from "@/features/types/api/course";
import { LessonLight } from "@/features/types/api/lesson";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function CoursePage() {
  // Use the URL directly instead of params
  const pathname = usePathname();
  const segments = pathname.split("/");
  const coursename = segments[segments.length - 1];
  const router = useRouter();

  const { data, isLoading, isError } = useCoursesAndLessonsForPreview();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<LessonLight[]>([]);

  useEffect(() => {
    if (data && coursename) {
      // Find the current course
      const currentCourse = data.courses.find(
        (c) => c.slug === coursename || c.id.toString() === coursename
      );

      if (currentCourse) {
        setCourse(currentCourse);

        // Find lessons for this course
        const courseLessons = data.lessons.filter(
          (l) => l.course?.id === currentCourse.id
        );

        setLessons(courseLessons);
      }
    }
  }, [data, coursename]);

  // 处理课程导航，使用客户端路由
  const handleLessonClick = (lessonSlug: string, e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/courses/${coursename}/${lessonSlug}`);
  };

  // 处理"开始学习"按钮点击
  const handleStartLearningClick = (e: React.MouseEvent) => {
    if (lessons.length > 0) {
      e.preventDefault();
      router.push(`/courses/${coursename}/${lessons[0].slug || lessons[0].id}`);
    }
  };

  if (isLoading) {
    return (
      <Flex direction="column" padding="xl" gap="l">
        <Skeleton shape="block" style={{ height: "40px", width: "60%" }} />
        <Skeleton shape="block" style={{ height: "24px", width: "80%" }} />
        <Skeleton shape="block" style={{ height: "24px", width: "40%" }} />

        <Flex direction="column" gap="m" style={{ marginTop: "32px" }}>
          <Skeleton shape="block" style={{ height: "32px", width: "30%" }} />
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              shape="block"
              style={{
                height: "80px",
                width: "100%",
                marginTop: "16px",
              }}
            />
          ))}
        </Flex>
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
          minHeight: "50vh",
        }}
      >
        <Text variant="heading-strong-l" color="error">
          Error loading course
        </Text>
        <Text
          variant="body-default-m"
          color="light"
          style={{ marginTop: "16px" }}
        >
          There was a problem loading this course. Please try again later.
        </Text>
      </Flex>
    );
  }

  if (!course) {
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
          Course not found
        </Text>
        <Text
          variant="body-default-m"
          color="light"
          style={{ marginTop: "16px" }}
        >
          The requested course could not be found.
        </Text>
      </Flex>
    );
  }

  // Calculate first lesson path for "Start Learning" button
  const firstLessonPath =
    lessons.length > 0
      ? `/courses/${coursename}/${lessons[0].slug || lessons[0].id}`
      : null;

  return (
    <Flex direction="column" padding="xl">
      {/* Course Header */}
      <Flex
        direction="column"
        gap="s"
        style={{
          marginBottom: "32px",
          borderBottom: "1px solid rgba(51, 102, 255, 0.2)",
          paddingBottom: "24px",
        }}
      >
        <Text variant="heading-strong-xl" color="light">
          {course.title}
        </Text>

        {course.description && (
          <Text
            variant="body-default-l"
            color="light"
            style={{ opacity: 0.8, marginTop: "8px", maxWidth: "800px" }}
          >
            {course.description}
          </Text>
        )}

        <Flex gap="m" style={{ marginTop: "16px" }}>
          {course.difficulty && (
            <Text
              variant="body-default-s"
              color="light"
              style={{ opacity: 0.7 }}
            >
              Difficulty: {course.difficulty}
            </Text>
          )}
          {course.duration && (
            <Text
              variant="body-default-s"
              color="light"
              style={{ opacity: 0.7 }}
            >
              Duration: {course.duration} min
            </Text>
          )}
          {course.locale && (
            <Text
              variant="body-default-s"
              color="light"
              style={{ opacity: 0.7 }}
            >
              Language: {course.locale}
            </Text>
          )}
        </Flex>

        {firstLessonPath && (
          <Link
            href={firstLessonPath}
            style={{ textDecoration: "none", marginTop: "24px" }}
            onClick={handleStartLearningClick}
          >
            <Button variant="primary" size="l">
              Start Learning
            </Button>
          </Link>
        )}
      </Flex>

      {/* Lessons Section */}
      <Flex direction="column">
        <Text
          variant="heading-strong-m"
          color="light"
          style={{ marginBottom: "16px" }}
        >
          Course Content
        </Text>

        {lessons.length > 0 ? (
          <Flex direction="column" gap="m">
            {lessons.map((lesson, index) => (
              <Link
                key={lesson.id}
                href={`/courses/${coursename}/${lesson.slug || lesson.id}`}
                style={{ textDecoration: "none" }}
                onClick={(e) =>
                  handleLessonClick(lesson.slug || lesson.id.toString(), e)
                }
              >
                <Flex
                  direction="column"
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    background: "rgba(51, 102, 255, 0.05)",
                    border: "1px solid rgba(51, 102, 255, 0.15)",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    marginBottom: "8px",
                  }}
                  className="hover:border-blue-500 hover:bg-opacity-10"
                >
                  <Flex
                    gap="s"
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Text
                      variant="body-strong-m"
                      color="primary"
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "rgba(51, 102, 255, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {index + 1}
                    </Text>
                    <Text variant="body-strong-m" color="light">
                      {lesson.title}
                    </Text>
                  </Flex>

                  {lesson.description && (
                    <Text
                      variant="body-default-s"
                      color="light"
                      style={{
                        opacity: 0.7,
                        marginTop: "8px",
                        marginLeft: "32px",
                      }}
                    >
                      {lesson.description}
                    </Text>
                  )}

                  <Flex
                    gap="m"
                    style={{
                      marginTop: "8px",
                      marginLeft: "32px",
                    }}
                  >
                    {lesson.duration && (
                      <Text
                        variant="body-default-xs"
                        color="light"
                        style={{ opacity: 0.6 }}
                      >
                        {lesson.duration} min
                      </Text>
                    )}
                    {lesson.type && (
                      <Text
                        variant="body-default-xs"
                        color="light"
                        style={{ opacity: 0.6 }}
                      >
                        {lesson.type}
                      </Text>
                    )}
                  </Flex>
                </Flex>
              </Link>
            ))}
          </Flex>
        ) : (
          <Flex
            direction="column"
            style={{
              padding: "24px",
              borderRadius: "12px",
              background: "rgba(51, 102, 255, 0.05)",
              border: "1px solid rgba(51, 102, 255, 0.2)",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "200px",
            }}
          >
            <Text
              variant="body-default-m"
              color="light"
              style={{ opacity: 0.7 }}
            >
              No lessons available for this course yet.
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
