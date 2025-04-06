import React from "react";
import { Flex, Skeleton } from "@/once-ui/components";

export const CourseDetailSkeleton: React.FC = () => {
  return (
    <Flex direction="column" padding="xl" gap="l" style={{ width: "100%" }}>
      {/* 课程标题和描述 */}
      <Flex direction="column" gap="s">
        <Skeleton shape="block" style={{ height: "40px", width: "70%" }} />
        <Skeleton shape="block" style={{ height: "24px", width: "90%" }} />
        <Skeleton shape="block" style={{ height: "24px", width: "85%" }} />
      </Flex>

      {/* 课程元数据 */}
      <Flex gap="m" wrap={true} style={{ marginTop: "8px" }}>
        <Skeleton
          shape="block"
          style={{
            height: "24px",
            width: "120px",
            borderRadius: "4px",
            opacity: 0.7,
          }}
        />
        <Skeleton
          shape="block"
          style={{
            height: "24px",
            width: "150px",
            borderRadius: "4px",
            opacity: 0.7,
          }}
        />
        <Skeleton
          shape="block"
          style={{
            height: "24px",
            width: "100px",
            borderRadius: "4px",
            opacity: 0.7,
          }}
        />
      </Flex>

      {/* 课程内容区块 */}
      <Flex
        direction="column"
        style={{
          marginTop: "32px",
          padding: "24px",
          borderRadius: "12px",
          background: "rgba(51, 102, 255, 0.05)",
          border: "1px solid rgba(51, 102, 255, 0.2)",
          width: "100%",
        }}
      >
        <Skeleton shape="block" style={{ height: "32px", width: "40%" }} />
        <Flex direction="column" gap="m" style={{ marginTop: "24px" }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              shape="block"
              style={{
                height: "24px",
                width: `${100 - i * 5}%`,
                borderRadius: "4px",
              }}
            />
          ))}
        </Flex>
      </Flex>

      {/* 课程章节列表 */}
      <Flex
        direction="column"
        gap="m"
        style={{ marginTop: "36px", width: "100%" }}
      >
        <Skeleton shape="block" style={{ height: "32px", width: "30%" }} />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton
            key={i}
            shape="block"
            style={{
              height: "72px",
              width: "100%",
              borderRadius: "8px",
            }}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default CourseDetailSkeleton;
