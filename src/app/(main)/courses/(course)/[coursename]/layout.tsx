"use client";

import { Flex, Column, Skeleton, Text } from "@/once-ui/components";
import { Metadata } from "next";
import { ReactNode, Suspense, useState, useEffect } from "react";
import { useCoursesAndLessonsForPreview } from "@/features/home-and-course-preview/api/use-get-courses-lessons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Course } from "@/features/types/api/course";
import { LessonLight } from "@/features/types/api/lesson";

// Course Sidebar component
const CourseSidebar = ({ coursePath }: { coursePath: string }) => {
  const { data, isLoading } = useCoursesAndLessonsForPreview();
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const pathname = usePathname();

  // Find the active course and set it
  useEffect(() => {
    if (data?.courses && coursePath) {
      const course = data.courses.find(
        (c: Course) => c.slug === coursePath || c.id.toString() === coursePath
      );
      if (course) {
        setActiveCourse(course);
      }
    }
  }, [data, coursePath]);

  if (isLoading) {
    return <CourseSidebarSkeleton />;
  }

  return (
    <Flex
      direction="column"
      style={{
        width: "280px",
        height: "100vh",
        borderRight: "1px solid rgba(51, 102, 255, 0.3)",
        background: "rgba(18, 18, 40, 0.95)",
        overflow: "hidden",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Sidebar Header */}
      <Flex
        direction="column"
        padding="l"
        style={{
          borderBottom: "1px solid rgba(51, 102, 255, 0.3)",
        }}
      >
        <Text variant="heading-strong-s" color="light">
          Course Navigation
        </Text>
        <Text
          variant="body-default-s"
          color="light"
          style={{ opacity: 0.7, marginTop: "8px" }}
        >
          Browse all available courses
        </Text>
      </Flex>

      {/* Courses List */}
      <Flex
        direction="column"
        style={{
          overflowY: "auto",
          flex: 1,
          padding: "8px",
        }}
      >
        {data?.courses?.map((course: Course, index: number) => (
          <Link
            href={`/courses/${course.slug || course.id}`}
            key={course.id}
            style={{ textDecoration: "none" }}
          >
            <Flex
              direction="column"
              padding="m"
              style={{
                borderRadius: "8px",
                marginBottom: "8px",
                background:
                  activeCourse?.id === course.id
                    ? "rgba(51, 102, 255, 0.2)"
                    : "transparent",
                cursor: "pointer",
                transition: "all 0.2s ease",
                border: "1px solid",
                borderColor:
                  activeCourse?.id === course.id
                    ? "rgba(51, 102, 255, 0.5)"
                    : "transparent",
              }}
            >
              <Text variant="body-strong-s" color="light">
                {course.title}
              </Text>
              {course.description && (
                <Text
                  variant="body-default-xs"
                  color="light"
                  style={{
                    opacity: 0.7,
                    marginTop: "4px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {course.description}
                </Text>
              )}
              <Flex
                gap="m"
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  opacity: 0.6,
                }}
              >
                {course.difficulty && (
                  <Text variant="body-default-xs" color="light">
                    {course.difficulty}
                  </Text>
                )}
                {course.duration && (
                  <Text variant="body-default-xs" color="light">
                    {course.duration} min
                  </Text>
                )}
              </Flex>
            </Flex>
          </Link>
        ))}
      </Flex>
    </Flex>
  );
};

// Skeleton component for the sidebar
const CourseSidebarSkeleton = () => {
  return (
    <Flex
      direction="column"
      style={{
        width: "280px",
        height: "100vh",
        borderRight: "1px solid rgba(51, 102, 255, 0.15)",
        background: "rgba(18, 18, 40, 0.95)",
        padding: "24px 16px",
      }}
    >
      <Skeleton
        shape="block"
        style={{ height: "28px", width: "80%", marginBottom: "8px" }}
      />
      <Skeleton
        shape="block"
        style={{ height: "16px", width: "60%", marginBottom: "24px" }}
      />

      {Array.from({ length: 5 }).map((_, i) => (
        <Flex key={i} direction="column" style={{ marginBottom: "16px" }}>
          <Skeleton
            shape="block"
            style={{ height: "24px", width: "90%", marginBottom: "8px" }}
          />
          <Skeleton
            shape="block"
            style={{ height: "16px", width: "70%", marginBottom: "8px" }}
          />
          <Skeleton shape="block" style={{ height: "12px", width: "40%" }} />
        </Flex>
      ))}
    </Flex>
  );
};

const CourseLayout = ({ children }: { children: ReactNode }) => {
  // Use the URL directly instead of params
  const pathname = usePathname();
  const segments = pathname.split("/");
  const coursename = segments[segments.length - 1];

  return (
    <Flex
      style={{
        width: "100%",
        maxWidth: "1920px",
        height: "100vh",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      <Suspense fallback={<CourseSidebarSkeleton />}>
        <div className="hidden md:block">
          <CourseSidebar coursePath={coursename} />
        </div>
      </Suspense>
      <Flex
        style={{
          flex: 1,
          height: "100vh",
          overflowY: "auto",
          background: "var(--bg-surface)",
        }}
      >
        {children}
      </Flex>
    </Flex>
  );
};

export default CourseLayout;
