"use client";

import React from "react";
import { Text, Flex, Skeleton } from "@/once-ui/components";
import styles from "./index.module.scss";

export const LessonsBoxesSkeleton = () => {
  return (
    <Flex direction="column" className={styles.container}>
      {/* Banner区域骨架屏 */}
      <Flex
        direction="column"
        className={styles.bannerSkeleton}
        style={{
          height: "400px",
          background:
            "linear-gradient(to right, rgba(20, 27, 77, 0.7), rgba(27, 38, 108, 0.7))",
          borderRadius: "12px",
          padding: "40px",
          position: "relative",
          overflow: "hidden",
          marginBottom: "50px",
        }}
      >
        <Flex direction="column" gap="l" style={{ maxWidth: "600px" }}>
          <Skeleton shape="line" width="l" height="m" delay="1" />
          <Skeleton shape="line" width="xl" height="l" delay="2" />
          <Skeleton shape="line" width="m" height="s" delay="3" />
          <Flex style={{ marginTop: "20px" }}>
            <Skeleton
              shape="block"
              width="m"
              height="s"
              delay="3"
              style={{ width: "130px", height: "40px" }}
            />
          </Flex>
        </Flex>
      </Flex>

      {/* 课程分类区域骨架屏 */}
      <Flex
        direction="column"
        style={{
          position: "relative",
          zIndex: 5,
          marginTop: "0px",
          marginBottom: "30px",
          width: "100%",
        }}
      >
        {/* 分类标题骨架屏 */}
        <Flex
          id="lessons-section-title"
          style={{ marginBottom: "24px", alignItems: "center" }}
        >
          <Skeleton
            shape="line"
            width="l"
            height="s"
            delay="1"
            style={{ width: "160px", height: "24px" }}
          />
          <Flex style={{ marginLeft: "16px", flex: 1 }}>
            <Skeleton
              shape="line"
              width="xl"
              height="xs"
              delay="2"
              style={{ width: "100%", height: "2px" }}
            />
          </Flex>
        </Flex>

        {/* 分类标签骨架屏 */}
        <Flex gap="m" style={{ marginBottom: "20px", flexWrap: "wrap" }}>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton
              key={i}
              shape="block"
              width="m"
              height="s"
              delay={i % 3 === 0 ? "3" : i % 3 === 1 ? "1" : "2"}
              style={{ borderRadius: "16px", width: "100px", height: "32px" }}
            />
          ))}
        </Flex>
      </Flex>

      {/* 内容区域 - 课时骨架屏 */}
      <Flex
        style={{
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "space-between",
        }}
      >
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Flex
              key={i}
              direction="column"
              style={{
                width: "calc(33.33% - 16px)",
                minWidth: "300px",
                height: "280px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                overflow: "hidden",
                padding: "16px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Flex
                style={{
                  height: "140px",
                  background: "rgba(0, 0, 0, 0.2)",
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              >
                <Skeleton
                  shape="block"
                  width="xl"
                  height="xl"
                  delay={i % 3 === 0 ? "3" : i % 3 === 1 ? "1" : "2"}
                  style={{ width: "100%", height: "100%" }}
                />
              </Flex>
              <Skeleton
                shape="line"
                width="l"
                height="m"
                delay={i % 3 === 0 ? "3" : i % 3 === 1 ? "1" : "2"}
                style={{ marginBottom: "8px", width: "70%" }}
              />
              <Skeleton
                shape="line"
                width="xl"
                height="s"
                delay={i % 3 === 0 ? "3" : i % 3 === 1 ? "1" : "2"}
                style={{ marginBottom: "12px", width: "90%" }}
              />
              <Flex gap="s">
                <Skeleton
                  shape="block"
                  width="s"
                  height="xs"
                  delay={i % 3 === 0 ? "3" : i % 3 === 1 ? "1" : "2"}
                  style={{
                    borderRadius: "11px",
                    width: "60px",
                    height: "22px",
                  }}
                />
                <Skeleton
                  shape="block"
                  width="m"
                  height="xs"
                  delay={i % 3 === 0 ? "3" : i % 3 === 1 ? "1" : "2"}
                  style={{
                    borderRadius: "11px",
                    width: "80px",
                    height: "22px",
                  }}
                />
              </Flex>
            </Flex>
          ))}
      </Flex>
    </Flex>
  );
};
