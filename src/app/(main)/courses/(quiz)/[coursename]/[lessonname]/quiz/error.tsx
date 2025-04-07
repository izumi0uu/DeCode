"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Flex, Text, Button, Card } from "@/once-ui/components";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const coursename = window.location.pathname.split("/")[2]; // 从URL中获取课程名
  const lessonname = window.location.pathname.split("/")[3]; // 从URL中获取课程章节名

  return (
    <Flex
      direction="column"
      padding="xl"
      style={{
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
      }}
    >
      <Card padding="xl" style={{ maxWidth: "600px", width: "100%" }}>
        <Flex direction="column" gap="l" style={{ alignItems: "center" }}>
          <Text variant="heading-strong-m" color="error">
            Failed to load quiz
          </Text>
          <Text
            variant="body-default-m"
            style={{ marginTop: "16px", textAlign: "center" }}
          >
            {error?.message ||
              "Failed to obtain test data, please try again later"}
          </Text>
          <Text
            variant="body-default-m"
            style={{ marginTop: "8px", textAlign: "center" }}
          >
            This course may not have any quizzes associated with it yet, or the
            backend service may be temporarily unavailable.
          </Text>
          <Flex gap="m" style={{ marginTop: "24px" }}>
            <Button
              variant="secondary"
              onClick={() =>
                router.push(`/courses/${coursename}/${lessonname}`)
              }
            >
              Back to Course
            </Button>
            <Button variant="primary" onClick={reset}>
              Retry
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
