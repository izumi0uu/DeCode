"use client";

import { useState, useEffect } from "react";
import { Flex } from "@/once-ui/components";
import { CascaderProps } from "@/components/cascader";
import { CascaderInteraction } from "@/components/cascaderInteraction";
import { navigateTo } from "@/app/actions/navigateTo";
import { getNavigation } from "@/app/actions/navigation";
import { NavNode } from "@/types/navigation";
import styles from "./index.module.scss";

const CascaderContent = ({ currentPath }: Omit<CascaderProps, "onSelect">) => {
  const [navigationData, setNavigationData] = useState<NavNode[]>([]);

  useEffect(() => {
    getNavigation().then((navigation) => {
      if (navigation.success) setNavigationData(navigation.data as NavNode[]);
    });
  }, []);

  return (
    <CascaderInteraction onSelect={navigateTo}>
      <Flex direction="column" radius="m">
        {navigationData?.map((course) => (
          <Flex
            key={course.id}
            className={styles.course}
            paddingY="8"
            paddingX="12"
            background="brand-medium"
          >
            <Flex
              className={styles.courseTitle}
              radius="m"
              paddingY="4"
              paddingX="8"
              transition="micro-long"
              fillWidth
            >
              {course.title}
            </Flex>

            {course.children && (
              <Flex className={styles.lessonList}>
                {course.children.map((lesson) => (
                  <Flex
                    key={lesson.id}
                    className={styles.lessonItem}
                    background="brand-medium"
                  >
                    <Flex
                      className={styles.lessonTitle}
                      radius="m"
                      paddingY="4"
                      paddingX="8"
                      transition="micro-long"
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

export { CascaderContent };
