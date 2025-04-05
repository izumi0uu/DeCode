"use client";

import {
  Flex,
  Column,
  Skeleton,
  Text,
  Scroller,
  SmartImage,
} from "@/once-ui/components";
import {
  ReactNode,
  Suspense,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { usePopularCourses } from "@/features/home-and-course-preview/api/use-get-courses-popular";
import { usePathname, useRouter } from "next/navigation";
import { Course } from "@/features/types/api/course";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

// 创建一个Context来保持课程数据
import { createContext, useContext } from "react";

// 创建一个课程数据Context
const CourseContext = createContext<{
  courses: Course[] | undefined;
  activeCourseId: number | null;
  setActiveCourseId: (id: number | null) => void;
}>({
  courses: undefined,
  activeCourseId: null,
  setActiveCourseId: () => {},
});

// Course Sidebar component
const CourseSidebar = ({ coursePath }: { coursePath: string }) => {
  const { data, isLoading } = usePopularCourses();
  const { courses, activeCourseId, setActiveCourseId } =
    useContext(CourseContext);
  const router = useRouter();

  // 当路径变化时更新活动课程，但不会重新渲染整个列表
  useEffect(() => {
    if (data && coursePath) {
      const course = data.find(
        (c: Course) => c.slug === coursePath || c.id.toString() === coursePath
      );
      if (course) {
        setActiveCourseId(course.id);
      }
    }
  }, [data, coursePath, setActiveCourseId]);

  // 处理课程点击，使用客户端路由进行导航而不是重新加载
  const handleCourseClick = useCallback(
    (course: Course, e: React.MouseEvent) => {
      e.preventDefault();
      setActiveCourseId(course.id);
      router.push(`/courses/${course.slug || course.id}`);
    },
    [router, setActiveCourseId]
  );

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
    active: {
      y: 0,
      scale: 1,
      backgroundColor: "rgba(51, 102, 255, 0.15)",
      borderColor: "rgba(51, 102, 255, 0.5)",
      boxShadow: "0 8px 16px rgba(0, 0, 255, 0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  const getPlaceholderImage = (courseId: number) => {
    const imageIndex = (courseId % 5) + 1;
    return `/images/cover${imageIndex}.jpg`;
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
        <LayoutGroup id="course-list">
          <AnimatePresence initial={false} mode="sync">
            {courses?.map((course: Course, index: number) => (
              <motion.div
                key={course.id}
                layout="position"
                layoutId={`course-${course.id}`}
                custom={index}
                initial={false}
                animate={activeCourseId === course.id ? "active" : "visible"}
                whileHover="hover"
                whileTap="tap"
                variants={cardVariants}
                onClick={(e) => handleCourseClick(course, e)}
                style={{ marginBottom: "16px", cursor: "pointer" }}
              >
                <Flex
                  direction="column"
                  padding="m"
                  style={{
                    borderRadius: "12px",
                    background:
                      activeCourseId === course.id
                        ? "rgba(51, 102, 255, 0.15)"
                        : "rgba(30, 30, 60, 0.4)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    border: "1px solid",
                    borderColor:
                      activeCourseId === course.id
                        ? "rgba(51, 102, 255, 0.5)"
                        : "rgba(51, 102, 255, 0.1)",
                    boxShadow:
                      activeCourseId === course.id
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
                      position: "relative",
                    }}
                  >
                    <SmartImage
                      src={
                        course.coverImage?.formats?.small?.url
                          ? `${
                              process.env.NEXT_PUBLIC_STRAPI_API_URL ||
                              "http://localhost:1337"
                            }${course.coverImage.formats.small.url}`
                          : getPlaceholderImage(course.id)
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
            ))}
          </AnimatePresence>
        </LayoutGroup>
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

// Course Layout wrapper component that provides the context
const CourseLayout = ({ children }: { children: ReactNode }) => {
  // Use the URL directly instead of params
  const pathname = usePathname();
  const segments = pathname.split("/");
  const coursename = segments[segments.length - 1];

  const { data } = usePopularCourses();
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);

  // 使用useMemo缓存课程数据，防止重新渲染时重新创建
  const courseContextValue = useMemo(
    () => ({
      courses: data,
      activeCourseId,
      setActiveCourseId,
    }),
    [data, activeCourseId, setActiveCourseId]
  );

  return (
    <CourseContext.Provider value={courseContextValue}>
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
    </CourseContext.Provider>
  );
};

export default CourseLayout;
