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
            className={styles.courseItem}
            background="brand-medium"
            transition="micro-long"
          >
            <Flex>{course.title}</Flex>
            {course.children && (
              <Flex className={styles.lessonList}>
                {course.children.map((lesson) => (
                  <Flex
                    key={lesson.id}
                    className={styles.lessonItem}
                    background="brand-medium"
                    transition="micro-long"
                  >
                    {lesson.title}
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
