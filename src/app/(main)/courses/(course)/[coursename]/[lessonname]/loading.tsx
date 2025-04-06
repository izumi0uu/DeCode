import React from "react";
import { Flex, Skeleton } from "@/once-ui/components";

export default function LessonLoading() {
  return (
    <Flex direction="column" padding="xl">
      <Flex direction="column" gap="s" style={{ marginBottom: "32px" }}>
        {/* 课程标题 - 更改宽度为70% */}
        <Skeleton shape="block" style={{ height: "40px", width: "70%" }} />

        {/* 课程描述 - 调整为两行，更改宽度 */}
        <Skeleton shape="block" style={{ height: "24px", width: "90%" }} />
        <Skeleton shape="block" style={{ height: "24px", width: "85%" }} />

        {/* 元数据信息 - 持续时间和类型 */}
        <Flex gap="m" style={{ marginTop: "16px" }}>
          <Skeleton
            shape="block"
            style={{
              height: "20px",
              width: "140px", // 更具体的宽度
              borderRadius: "4px",
              opacity: 0.6,
            }}
          />
          <Skeleton
            shape="block"
            style={{
              height: "20px",
              width: "120px", // 更具体的宽度
              borderRadius: "4px",
              opacity: 0.6,
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
            width: "95%",
            marginTop: "12px",
            opacity: 0.7,
          }}
        />
        <Skeleton
          shape="block"
          style={{
            height: "24px",
            width: "90%",
            marginTop: "12px",
            opacity: 0.7,
          }}
        />
        <Skeleton
          shape="block"
          style={{
            height: "24px",
            width: "85%",
            marginTop: "12px",
            opacity: 0.7,
          }}
        />
        <Skeleton
          shape="block"
          style={{
            height: "24px",
            width: "80%",
            marginTop: "12px",
            opacity: 0.7,
          }}
        />
        <Skeleton
          shape="block"
          style={{
            height: "24px",
            width: "75%",
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
          width: "100%",
        }}
      />

      {/* 导航按钮区域 */}
      <Flex
        style={{
          marginTop: "32px",
          padding: "24px 0",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Skeleton
          shape="block"
          style={{
            height: "40px",
            width: "180px",
            borderRadius: "4px",
          }}
        />
        <Skeleton
          shape="block"
          style={{
            height: "40px",
            width: "180px",
            borderRadius: "4px",
          }}
        />
      </Flex>
    </Flex>
  );
}
