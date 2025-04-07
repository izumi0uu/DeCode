"use client";

import React from "react";
import { Flex, Text } from "@/once-ui/components";

export default function Loading() {
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
      <Text variant="body-strong-l">Loading...</Text>
    </Flex>
  );
}
