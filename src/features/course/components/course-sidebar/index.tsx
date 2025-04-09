"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Flex, Text, Scroller } from "@/once-ui/components";
import { motion, AnimatePresence } from "framer-motion";
import { Course } from "@/features/types/api/course";
import { useCourseContext } from "@/features/course/context/CourseContext";
import { CourseCard } from "@/features/course/components/course-card";
import { CourseSidebarSkeleton } from "@/features/course/components/skeletons";
import { usePopularCourses } from "@/features/home-and-course-preview/api/use-get-courses-popular";

// 侧边栏标题组件
const SidebarHeader = () => (
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
);

// 课程列表组件
export const CourseList = ({
  courses,
  activeCourseId,
  onCourseClick,
}: {
  courses: Course[] | undefined;
  activeCourseId: number | null;
  onCourseClick: (course: Course, e: React.MouseEvent) => void;
}) => (
  <Scroller
    direction="column"
    style={{
      flex: 1,
      padding: "16px",
      overflowY: "auto",
      width: "100%",
    }}
  >
    <motion.div style={{ width: "100%" }}>
      <AnimatePresence initial={false}>
        {courses?.map((course: Course, index: number) => (
          <CourseCard
            key={course.id}
            course={course}
            isActive={activeCourseId === course.id}
            index={index}
            onCourseClick={onCourseClick}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  </Scroller>
);

// 侧边栏主组件
interface CourseSidebarProps {
  coursePath: string;
}

const CourseSidebar = ({ coursePath }: CourseSidebarProps) => {
  const { data, isLoading } = usePopularCourses();
  const { courses, activeCourseId, setActiveCourseId } = useCourseContext();
  const router = useRouter();

  // 当路径变化时更新活动课程
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

  // 处理课程点击
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

  return (
    <Flex
      direction="column"
      style={{
        width: "400px",
        height: "100vh",
        borderRight: "1px solid rgba(51, 102, 255, 0.3)",
        background: "rgba(18, 18, 40, 0.95)",
        position: "sticky",
        top: 0,
        overflow: "hidden",
      }}
    >
      <SidebarHeader />
      <CourseList
        courses={courses}
        activeCourseId={activeCourseId}
        onCourseClick={handleCourseClick}
      />
    </Flex>
  );
};

export { CourseSidebar };
