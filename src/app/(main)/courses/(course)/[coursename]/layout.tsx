"use client";

import {
  Flex,
  Column,
  Skeleton,
  Text,
  Scroller,
  SmartImage,
} from "@/once-ui/components";
import { Metadata } from "next";
import { ReactNode, Suspense, useState, useEffect } from "react";
import { useCoursesAndLessonsForPreview } from "@/features/home-and-course-preview/api/use-get-courses-lessons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Course } from "@/features/types/api/course";
import { LessonLight } from "@/features/types/api/lesson";
import { motion, AnimatePresence } from "framer-motion";

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

  // Animation variants for the course cards
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    }),
    hover: {
      y: -10,
      scale: 1.03,
      boxShadow: "0 10px 20px rgba(0, 0, 255, 0.15)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.98,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <Flex
      direction="column"
      style={{
        width: "320px",
        height: "100vh",
        borderRight: "1px solid rgba(51, 102, 255, 0.3)",
        background: "rgba(18, 18, 40, 0.95)",
        position: "sticky",
        top: 0,
        overflow: "hidden",
      }}
    >
      {/* Sidebar Header */}
      <Flex
        direction="column"
        padding="l"
        style={{
          borderBottom: "1px solid rgba(51, 102, 255, 0.3)",
          background:
            "linear-gradient(180deg, rgba(51,102,255,0.2) 0%, rgba(18,18,40,0) 100%)",
        }}
      >
        <Text variant="heading-strong-s" color="light">
          Course Navigator
        </Text>
        <Text
          variant="body-default-s"
          color="light"
          style={{ opacity: 0.7, marginTop: "8px" }}
        >
          Explore our Web3 curriculum
        </Text>
      </Flex>

      {/* Courses List with Scroller */}
      <Scroller
        direction="column"
        style={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
        }}
      >
        <AnimatePresence>
          {data?.courses?.map((course: Course, index: number) => (
            <Link
              href={`/courses/${course.slug || course.id}`}
              key={course.id}
              style={{ textDecoration: "none" }}
            >
              <motion.div
                custom={index}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover="hover"
                whileTap="tap"
                variants={cardVariants}
                layout
              >
                <Flex
                  direction="column"
                  padding="m"
                  style={{
                    borderRadius: "12px",
                    marginBottom: "16px",
                    background:
                      activeCourse?.id === course.id
                        ? "rgba(51, 102, 255, 0.15)"
                        : "rgba(30, 30, 60, 0.4)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    border: "1px solid",
                    borderColor:
                      activeCourse?.id === course.id
                        ? "rgba(51, 102, 255, 0.5)"
                        : "rgba(51, 102, 255, 0.1)",
                    boxShadow:
                      activeCourse?.id === course.id
                        ? "0 8px 16px rgba(0, 0, 255, 0.1)"
                        : "none",
                    overflow: "hidden",
                  }}
                >
                  {/* Course Image */}
                  <Flex
                    style={{
                      height: "120px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      marginBottom: "12px",
                    }}
                  >
                    <SmartImage
                      src={
                        course.coverImage
                          ? course.coverImage.url
                          : `/images/course-placeholder-${(index % 5) + 1}.jpg`
                      }
                      alt={course.title}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Flex>

                  {/* Fallback for image in case it doesn't load */}
                  {!course.coverImage && (
                    <Flex
                      style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        background: `linear-gradient(135deg, rgba(51,102,255,0.3) 0%, rgba(18,18,40,0.8) 100%)`,
                        width: "100%",
                        height: "120px",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <Text variant="heading-strong-l" color="light">
                        {course.title.charAt(0)}
                      </Text>
                    </Flex>
                  )}

                  {/* Course Info */}
                  <Text
                    variant="body-strong-s"
                    color="light"
                    style={{
                      fontSize: "16px",
                      lineHeight: "24px",
                    }}
                  >
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

                  {/* Course Meta */}
                  <Flex
                    gap="m"
                    style={{
                      marginTop: "12px",
                      fontSize: "12px",
                    }}
                  >
                    {course.difficulty && (
                      <Flex
                        style={{
                          background: getDifficultyColor(course.difficulty),
                          borderRadius: "4px",
                          padding: "4px 8px",
                        }}
                      >
                        <Text
                          variant="body-default-xs"
                          color="light"
                          style={{ fontSize: "11px" }}
                        >
                          {course.difficulty}
                        </Text>
                      </Flex>
                    )}
                    {course.duration && (
                      <Flex
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          borderRadius: "4px",
                          padding: "4px 8px",
                        }}
                      >
                        <Text
                          variant="body-default-xs"
                          color="light"
                          style={{ fontSize: "11px" }}
                        >
                          {course.duration} min
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                </Flex>
              </motion.div>
            </Link>
          ))}
        </AnimatePresence>
      </Scroller>
    </Flex>
  );
};

// Helper function to get color based on difficulty
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "rgba(0, 200, 83, 0.2)";
    case "intermediate":
      return "rgba(255, 170, 0, 0.2)";
    case "advanced":
      return "rgba(255, 71, 87, 0.2)";
    default:
      return "rgba(255, 255, 255, 0.1)";
  }
};

// Skeleton component for the sidebar
const CourseSidebarSkeleton = () => {
  return (
    <Flex
      direction="column"
      style={{
        width: "320px",
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

      {Array.from({ length: 3 }).map((_, i) => (
        <Flex key={i} direction="column" style={{ marginBottom: "24px" }}>
          <Skeleton
            shape="block"
            style={{
              height: "120px",
              width: "100%",
              marginBottom: "12px",
              borderRadius: "8px",
            }}
          />
          <Skeleton
            shape="block"
            style={{ height: "24px", width: "90%", marginBottom: "8px" }}
          />
          <Skeleton
            shape="block"
            style={{ height: "16px", width: "70%", marginBottom: "8px" }}
          />
          <Flex gap="m">
            <Skeleton
              shape="block"
              style={{ height: "20px", width: "60px", borderRadius: "4px" }}
            />
            <Skeleton
              shape="block"
              style={{ height: "20px", width: "40px", borderRadius: "4px" }}
            />
          </Flex>
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
