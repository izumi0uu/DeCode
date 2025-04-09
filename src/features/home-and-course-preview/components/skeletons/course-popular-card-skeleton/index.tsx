import React from "react";
import { Flex, Skeleton } from "@/once-ui/components";
import styles from "./index.module.scss";

interface CoursePopularCardSkeletonProps {
  count?: number;
}

export const CoursePopularCardSkeleton: React.FC = () => {
  return (
    <div className={styles.skeleton}>
      <Flex direction="column" gap="m" padding="m">
        {/* 圆形图标区域 */}
        <Flex
          center
          align="center"
          style={{ marginTop: "8px", marginBottom: "16px" }}
        >
          <Skeleton
            shape="circle"
            width="xl"
            height="xl"
            delay="1"
            style={{
              width: "120px",
              height: "120px",
              position: "relative",
            }}
          />
        </Flex>

        <Flex direction="column" gap="m">
          {/* 标题区域 */}
          <Skeleton
            shape="line"
            width="l"
            height="m"
            delay="2"
            style={{ width: "90%" }}
          />

          {/* 难度和时长区域 */}
          <Flex align="center" gap="xs" style={{ marginBottom: "8px" }}>
            <Skeleton shape="line" width="s" height="xs" delay="3" />
            <Skeleton
              shape="circle"
              width="xs"
              height="xs"
              delay="1"
              style={{ width: "4px", height: "4px" }}
            />
            <Skeleton shape="line" width="m" height="xs" delay="2" />
          </Flex>

          {/* 标签区域 */}
          <Flex gap="xs" wrap style={{ marginTop: "4px" }}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                shape="block"
                width="s"
                height="xs"
                delay={`${(i % 3) + 1}` as "1" | "2" | "3"}
                style={{
                  borderRadius: "999px",
                  minWidth: "60px",
                }}
              />
            ))}
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export const CoursePopularCardSkeletons: React.FC<
  CoursePopularCardSkeletonProps
> = ({ count = 4 }) => {
  return (
    <Flex className={styles.container} wrap gap="l">
      {Array.from({ length: count }).map((_, index) => (
        <CoursePopularCardSkeleton key={index} />
      ))}
    </Flex>
  );
};

export type { CoursePopularCardSkeletonProps };
export default CoursePopularCardSkeletons;
