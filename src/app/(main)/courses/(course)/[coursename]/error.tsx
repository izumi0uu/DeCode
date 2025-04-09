"use client"; // 错误边界需要client组件

import React from "react";
import { Flex, Text, Button } from "@/once-ui/components";
import { useRouter } from "next/navigation";

export default function CourseError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <Flex
      direction="column"
      padding="xl"
      style={{
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
      }}
    >
      <Text variant="heading-strong-l" color="error">
        Error loading course
      </Text>
      <Text
        variant="body-default-m"
        color="light"
        style={{ marginTop: "16px", textAlign: "center", maxWidth: "600px" }}
      >
        {error.message || "An unexpected error occurred"}
      </Text>
      <Text
        variant="body-default-s"
        color="light"
        style={{
          marginTop: "8px",
          opacity: 0.7,
          maxWidth: "600px",
          textAlign: "center",
        }}
      >
        {error.message || "An unexpected error occurred"}
      </Text>

      <Flex gap="m" style={{ marginTop: "32px" }}>
        <Button variant="secondary" onClick={() => reset()}>
          Try again
        </Button>
        <Button variant="tertiary" onClick={() => router.push("/courses")}>
          Back to courses
        </Button>
      </Flex>
    </Flex>
  );
}
