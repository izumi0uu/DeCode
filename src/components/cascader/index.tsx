"use client";

import { Flex, Skeleton } from "@/once-ui/components";
import { CascaderInteraction } from "@/components/cascaderInteraction";
import { navigateTo } from "@/app/actions/navigateTo";
import { NavNode } from "@/features/types/ui/nav-node";
import styles from "./index.module.scss";
import { useCoursesAndLessons } from "@/features/home-and-course-preview/api/use-get-courses-lessons";

export interface CascaderProps {
  data?: NavNode[];
  onSelect?: (path: string) => void;
  currentPath?: string;
}

const Cascader = ({ currentPath }: Omit<CascaderProps, "onSelect">) => {
  const { data: navigationData, isLoading, error } = useCoursesAndLessons();

  if (error || !navigationData) return null;

  if (isLoading)
    return (
      <Flex direction="column" radius="m" className={styles.cascaderContent}>
        {[1, 2, 3].map((item) => (
          <Flex
            key={item}
            className={styles.course}
            paddingY="8"
            paddingX="12"
            background="brand-medium"
            radius="m"
          >
            <Flex radius="m" paddingY="4" paddingX="8" fillWidth>
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
    );

  return (
    <CascaderInteraction onSelect={navigateTo}>
      <Flex direction="column" radius="m" className={styles.cascaderContent}>
        {navigationData?.data.map((course: NavNode) => (
          <Flex
            key={course.id}
            className={styles.course}
            paddingY="8"
            paddingX="12"
            background="brand-medium"
            radius="m"
          >
            <Flex
              className={styles.courseTitle}
              radius="m"
              paddingY="4"
              paddingX="8"
              fillWidth
            >
              {course.title}
            </Flex>

            {course.children && (
              <Flex className={styles.lessonList} radius="m" direction="column">
                {course.children.map((lesson) => (
                  <Flex
                    key={lesson.id}
                    className={styles.lessonItem}
                    background="brand-medium"
                    paddingY="8"
                    paddingX="12"
                    radius="m"
                  >
                    <Flex
                      className={styles.lessonTitle}
                      radius="m"
                      paddingY="4"
                      paddingX="8"
                      fillWidth
                    >
                      {lesson.title}
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            )}
          </Flex>
        ))}
      </Flex>
    </CascaderInteraction>
  );
};

export { Cascader };
