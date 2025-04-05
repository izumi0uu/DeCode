"use client";

import React from "react";
import { Flex, Skeleton } from "@/once-ui/components";

export default function LessonLoading() {
  return (
    <Flex direction="column" padding="xl" gap="l">
      {/* Title and description skeletons */}
      <Flex direction="column" gap="m">
        <Skeleton shape="block" style={{ height: "40px", width: "60%" }} />
        <Skeleton shape="block" style={{ height: "24px", width: "40%" }} />
        <Flex gap="s" style={{ marginTop: "8px" }}>
          <Skeleton shape="block" style={{ height: "16px", width: "100px" }} />
          <Skeleton shape="block" style={{ height: "16px", width: "80px" }} />
        </Flex>
      </Flex>

      {/* Content skeleton */}
      <Flex direction="column" gap="m" style={{ marginTop: "24px" }}>
        <Skeleton shape="block" style={{ height: "300px", width: "100%" }} />
        <Skeleton shape="block" style={{ height: "200px", width: "100%" }} />
        <Skeleton shape="block" style={{ height: "150px", width: "80%" }} />
      </Flex>
    </Flex>
  );
}
