import React from "react";
import { Flex, Background } from "@/once-ui/components";
import styles from "./index.module.scss";

interface CoursePopularCardSkeletonProps {
  count?: number;
}

export const CoursePopularCardSkeleton: React.FC = () => {
  return (
    <div className={styles.skeleton}>
      <Background className={styles.card}>
        <Flex direction="column" className={styles.content} gap={16}>
          <div className={styles.image}></div>
          <Flex direction="column" gap={12} className={styles.info}>
            <div className={styles.title}></div>
            <div className={styles.subtitle}></div>
            <div className={styles.tags}>
              <div className={styles.tag}></div>
              <div className={styles.tag}></div>
            </div>
          </Flex>
        </Flex>
      </Background>
    </div>
  );
};

export const CoursePopularCardSkeletons: React.FC<
  CoursePopularCardSkeletonProps
> = ({ count = 4 }) => {
  return (
    <Flex className={styles.container} align="stretch" wrap="wrap" gap={24}>
      {Array.from({ length: count }).map((_, index) => (
        <CoursePopularCardSkeleton key={index} />
      ))}
    </Flex>
  );
};

export type { CoursePopularCardSkeletonProps };
export default CoursePopularCardSkeletons;
