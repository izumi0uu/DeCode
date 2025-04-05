"use client";

import React from "react";
import { Flex, Text, Button } from "@/once-ui/components";
import { useRouter, usePathname } from "next/navigation";

export default function LessonError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const coursename =
    pathSegments.length >= 2 ? pathSegments[pathSegments.length - 2] : "";

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
        Error loading lesson
      </Text>
      <Text
        variant="body-default-m"
        color="light"
        style={{ marginTop: "16px", textAlign: "center", maxWidth: "600px" }}
      >
        There was a problem loading this lesson. Please try again later.
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
        <Button
          variant="tertiary"
          onClick={() => router.push(`/courses/${coursename}`)}
        >
          Back to course
        </Button>
      </Flex>
    </Flex>
  );
}
