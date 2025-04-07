"use client";

import React from "react";
import { Card, Flex, Skeleton } from "@/once-ui/components";

export default function LoadingQuiz() {
  return (
    <Flex
      direction="column"
      style={{
        width: "100%",
        maxWidth: "1240px",
        margin: "0 auto",
        padding: "0 20px",
        gap: "24px",
      }}
    >
      {/* Quiz header skeleton */}
      <Flex
        style={{
          width: "100%",
          padding: "24px 0",
        }}
      >
        <Skeleton width="200px" height="32px" />
      </Flex>

      {/* Quiz content skeleton */}
      <Card
        style={{
          width: "100%",
          padding: "32px",
        }}
      >
        <Flex direction="column" style={{ gap: "32px" }}>
          {/* Quiz title skeleton */}
          <Skeleton width="70%" height="40px" />

          {/* Quiz description skeleton */}
          <Flex direction="column" style={{ gap: "12px" }}>
            <Skeleton width="90%" height="24px" />
            <Skeleton width="85%" height="24px" />
            <Skeleton width="60%" height="24px" />
          </Flex>

          {/* Question skeleton */}
          <Flex direction="column" style={{ gap: "24px", marginTop: "24px" }}>
            <Skeleton width="100%" height="100px" />
            <Flex direction="column" css={{ gap: "16px" }}>
              <Skeleton width="100%" height="64px" />
              <Skeleton width="100%" height="64px" />
              <Skeleton width="100%" height="64px" />
              <Skeleton width="100%" height="64px" />
            </Flex>
          </Flex>

          {/* Navigation buttons skeleton */}
          <Flex
            space-between
            style={{
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid $gray300",
            }}
          >
            <Skeleton width="120px" height="48px" />
            <Skeleton width="120px" height="48px" />
          </Flex>
        </Flex>
      </Card>

      {/* Question navigation skeleton */}
      <Flex
        center
        style={{
          width: "100%",
          padding: "24px 0",
        }}
      >
        <Flex style={{ gap: "12px" }}>
          {[1, 2, 3, 4, 5].map((_, index) => (
            <Skeleton key={index} width="xl" height="xl" borderRadius="50%" />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}
