import React from "react";
import { Flex, Skeleton } from "@/once-ui/components";

export const LessonSkeleton: React.FC = () => {
  return (
    <Flex direction="column" padding="xl" style={{ width: "100%" }}>
      <Flex
        direction="column"
        gap="s"
        style={{ marginBottom: "32px", width: "100%" }}
      >
        {/* 课程标题 - 使用100%宽度 */}
        <Skeleton shape="block" style={{ height: "40px", width: "100%" }} />

        {/* 课程描述 - 使用100%宽度 */}
        <Skeleton shape="block" style={{ height: "24px", width: "100%" }} />
        <Skeleton shape="block" style={{ height: "24px", width: "100%" }} />

        {/* 元数据信息 - 持续时间和类型 */}
        <Flex gap="m" style={{ marginTop: "16px", width: "100%" }}>
          <Skeleton
            shape="block"
            style={{
              height: "20px",
              width: "100%", // 更改为100%
              borderRadius: "4px",
              opacity: 0.6,
              flexGrow: 1, // 添加flexGrow属性使其填充可用空间
            }}
          />
          <Skeleton
            shape="block"
            style={{
              height: "20px",
              width: "100%", // 更改为100%
              borderRadius: "4px",
              opacity: 0.6,
              flexGrow: 1, // 添加flexGrow属性使其填充可用空间
            }}
          />
        </Flex>
      </Flex>

      {/* 主要内容区域 - 匹配蓝色背景内容框 */}
      <Flex
        direction="column"
        style={{
          padding: "24px",
          borderRadius: "12px",
          background: "rgba(51, 102, 255, 0.05)",
          border: "1px solid rgba(51, 102, 255, 0.2)",
          width: "100%", // 确保100%宽度
        }}
      >
        <Skeleton
          shape="block"
          style={{
            height: "24px",
            width: "100%",
            opacity: 0.7,
          }}
        />
        <Skeleton
          shape="block"
          style={{
            height: "24px",
            width: "100%",
            marginTop: "12px",
            opacity: 0.7,
          }}
        />
        <Skeleton
          shape="block"
          style={{
            height: "24px",
            width: "100%",
            marginTop: "12px",
            opacity: 0.7,
          }}
        />
        <Skeleton
          shape="block"
          style={{
            height: "24px",
            width: "100%",
            marginTop: "12px",
            opacity: 0.7,
          }}
        />
        <Skeleton
          shape="block"
          style={{
            height: "24px",
            width: "100%",
            marginTop: "12px",
            opacity: 0.7,
          }}
        />
        <Skeleton
          shape="block"
          style={{
            height: "24px",
            width: "100%",
            marginTop: "12px",
            opacity: 0.7,
          }}
        />
      </Flex>

      {/* 分割线 */}
      <div
        style={{
          height: "1px",
          background: "rgba(255, 255, 255, 0.1)",
          margin: "32px 0 16px",
          width: "100%", // 确保100%宽度
        }}
      />

      {/* 导航按钮区域 */}
      <Flex
        style={{
          marginTop: "32px",
          padding: "24px 0",
          display: "flex",
          justifyContent: "space-between",
          width: "100%", // 确保100%宽度
        }}
      >
        <Skeleton
          shape="block"
          style={{
            height: "40px",
            width: "45%", // 更改为百分比宽度
            borderRadius: "4px",
          }}
        />
        <Skeleton
          shape="block"
          style={{
            height: "40px",
            width: "45%", // 更改为百分比宽度
            borderRadius: "4px",
          }}
        />
      </Flex>
    </Flex>
  );
};

export default LessonSkeleton;
