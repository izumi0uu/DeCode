"use client";

import { Flex, Skeleton, Text } from "@/once-ui/components";
import { CascaderInteraction } from "@/components/cascaderInteraction";
import { navigateTo } from "@/app/actions/navigateTo";
import { NavNode } from "@/features/types/ui/nav-node";
import styles from "./index.module.scss";
import { useCoursesAndLessons } from "@/features/home-and-course-preview/api/use-get-courses-lessons";
import { useEffect, useRef, useState } from "react";

export interface CascaderProps {
  data?: NavNode[];
  onSelect?: (path: string) => void;
  currentPath?: string;
}

const Cascader = ({ currentPath }: Omit<CascaderProps, "onSelect">) => {
  const { data: navigationData, isLoading, error } = useCoursesAndLessons();
  const [activeCourse, setActiveCourse] = useState<NavNode | null>(null);
  const [isChangingCourse, setIsChangingCourse] = useState(false);
  const coursesColumnRef = useRef<HTMLDivElement>(null);

  console.log(navigationData);

  // 记录滚动位置
  const handleScroll = () => {
    if (coursesColumnRef.current && navigationData) {
      const container = coursesColumnRef.current;
      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;

      // 计算当前查看的课程索引
      const itemHeight = scrollHeight / navigationData.length;
      const centerIndex = Math.floor(
        (scrollTop + containerHeight / 2) / itemHeight
      );

      // 确保索引有效
      if (centerIndex >= 0 && centerIndex < navigationData.length) {
        const newActiveCourse = navigationData[centerIndex];
        if (activeCourse?.id !== newActiveCourse.id) {
          setIsChangingCourse(true);
          setActiveCourse(newActiveCourse);

          // 动画结束后重置状态
          setTimeout(() => {
            setIsChangingCourse(false);
          }, 300);
        }
      }
    }
  };

  // 滚动到指定课程
  const scrollToCourse = (courseId: string) => {
    if (coursesColumnRef.current && navigationData) {
      const index = navigationData.findIndex(
        (course) => course.id === courseId
      );
      if (index !== -1) {
        const container = coursesColumnRef.current;
        const scrollHeight = container.scrollHeight;
        const itemHeight = scrollHeight / navigationData.length;

        // 计算目标滚动位置
        const scrollTo = itemHeight * index;
        container.scrollTo({
          top: scrollTo,
          behavior: "smooth",
        });
      }
    }
  };

  // 如果没有选中课程，默认选中第一个
  useEffect(() => {
    if (!activeCourse && navigationData && navigationData.length > 0) {
      setActiveCourse(navigationData[0]);
    }
  }, [navigationData, activeCourse]);

  // 添加滚动事件监听
  useEffect(() => {
    const container = coursesColumnRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [navigationData]);

  if (error) return null;

  // 处理课程点击
  const handleCourseClick = (course: NavNode) => {
    setActiveCourse(course);
    scrollToCourse(course.id);
  };

  // 骨架屏加载状态
  if (isLoading) {
    return (
      <Flex className={styles.cascaderContent}>
        {/* 左侧列表骨架屏 */}
        <Flex direction="column" className={styles.coursesColumn}>
          {[1, 2, 3].map((item) => (
            <Flex
              key={item}
              className={styles.course}
              paddingY="8"
              paddingX="12"
            >
              <Flex paddingY="4" paddingX="8" fillWidth>
                <Skeleton
                  shape="line"
                  width="l"
                  height="s"
                  delay={item.toString() as "1" | "2" | "3"}
                />
              </Flex>
            </Flex>
          ))}
        </Flex>

        {/* 右侧列表骨架屏 */}
        <Flex direction="column" className={styles.lessonsColumn}>
          {[1, 2, 3].map((item) => (
            <Flex
              key={item}
              className={styles.lessonItem}
              paddingY="8"
              paddingX="12"
            >
              <Skeleton
                shape="line"
                width="l"
                height="s"
                delay={item.toString() as "1" | "2" | "3"}
              />
            </Flex>
          ))}
        </Flex>
      </Flex>
    );
  }

  // 无内容状态
  if (!navigationData || navigationData.length === 0) {
    return (
      <Flex className={styles.cascaderContent}>
        <Flex direction="column" className={styles.coursesColumn} padding="16">
          <Text color="gray400">暂无课程数据</Text>
        </Flex>

        <Flex direction="column" className={styles.lessonsColumn} padding="16">
          <Text color="gray400">请先选择课程</Text>
        </Flex>
      </Flex>
    );
  }

  return (
    <CascaderInteraction onSelect={navigateTo}>
      <Flex className={styles.cascaderContent}>
        {/* 左侧课程列表 */}
        <Flex
          direction="column"
          className={styles.coursesColumn}
          ref={coursesColumnRef}
        >
          {navigationData.map((course: NavNode) => (
            <Flex
              key={course.id}
              className={`${styles.course} ${
                activeCourse?.id === course.id ? styles.active : ""
              }`}
              paddingY="8"
              paddingX="12"
              onClick={() => handleCourseClick(course)}
            >
              <Flex
                className={styles.courseTitle}
                paddingY="4"
                paddingX="8"
                fillWidth
              >
                {course.title}
              </Flex>
            </Flex>
          ))}
        </Flex>

        {/* 右侧章节列表 */}
        <Flex
          direction="column"
          className={`${styles.lessonsColumn} ${
            isChangingCourse ? styles.activeCourseChange : ""
          }`}
        >
          {activeCourse?.children && activeCourse.children.length > 0 ? (
            // 有章节时显示章节列表
            activeCourse.children.map((lesson) => (
              <Flex
                key={lesson.id}
                className={styles.lessonItem}
                paddingY="8"
                paddingX="12"
                onClick={() => navigateTo(lesson.path)}
              >
                {/* 添加指针高亮区域 */}
                <div className={styles.pointerHighlight}></div>
                <Flex
                  className={styles.lessonTitle}
                  paddingY="4"
                  paddingX="8"
                  fillWidth
                >
                  {lesson.title}
                </Flex>
              </Flex>
            ))
          ) : (
            // 无章节时显示提示
            <Flex
              direction="column"
              padding="16"
              style={{
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                opacity: 0.6,
              }}
            >
              <Text color="gray400">该课程暂无章节内容</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </CascaderInteraction>
  );
};

export { Cascader };
