import React from "react";
import { Flex } from "@/once-ui/components";
import styles from "./index.module.scss";

interface CoursePopularCardSkeletonProps {
  count?: number;
}

export const CoursePopularCardSkeleton: React.FC = () => {
  return (
    <div className={styles.skeleton}>
      <Flex direction="column" className={styles.content} gap="4">
        {/* 圆形图标区域 */}
        <div className={styles.imageContainer}>
          <div className={styles.circleImage}></div>
        </div>

        <Flex direction="column" gap="4" className={styles.info}>
          {/* 标题区域 */}
          <div className={styles.title}></div>

          {/* 难度和时长区域 */}
          <Flex align="center" gap="2" className={styles.metaInfo}>
            <div className={styles.difficulty}></div>
            <div className={styles.dot}></div>
            <div className={styles.duration}></div>
          </Flex>

          {/* 标签区域 */}
          <div className={styles.tags}>
            <div className={styles.tag}></div>
            <div className={styles.tag}></div>
            <div className={styles.tag}></div>
            <div className={styles.tag}></div>
          </div>
        </Flex>
      </Flex>
    </div>
  );
};

export const CoursePopularCardSkeletons: React.FC<
  CoursePopularCardSkeletonProps
> = ({ count = 4 }) => {
  return (
    <Flex className={styles.container} wrap gap="8">
      {Array.from({ length: count }).map((_, index) => (
        <CoursePopularCardSkeleton key={index} />
      ))}
    </Flex>
  );
};

export type { CoursePopularCardSkeletonProps };
export default CoursePopularCardSkeletons;
