import React from "react";
import { Flex, Skeleton } from "@/once-ui/components";

export default function CourseLoading() {
  return (
    <Flex direction="column" padding="xl" gap="l">
      {/* Course Header Skeleton */}
      <Skeleton shape="block" style={{ height: "40px", width: "60%" }} />
      <Skeleton shape="block" style={{ height: "24px", width: "80%" }} />
      <Skeleton shape="block" style={{ height: "24px", width: "40%" }} />

      {/* Course Action Button Skeleton */}
      <Skeleton
        shape="block"
        style={{
          height: "48px",
          width: "180px",
          marginTop: "24px",
          borderRadius: "8px",
        }}
      />

      {/* Course Content Skeleton */}
      <Flex direction="column" gap="m" style={{ marginTop: "32px" }}>
        <Skeleton shape="block" style={{ height: "32px", width: "30%" }} />
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            shape="block"
            style={{
              height: "80px",
              width: "100%",
              marginTop: "16px",
              borderRadius: "8px",
            }}
          />
        ))}
      </Flex>
    </Flex>
  );
}
