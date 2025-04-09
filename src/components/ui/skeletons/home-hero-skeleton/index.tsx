"use client";

import { Column, Flex, Skeleton } from "@/once-ui/components";

export const HomeHeroSkeleton = () => {
  return (
    <Column fillWidth paddingY="l" gap="m">
      <Column maxWidth="l" gap="xl" horizontal="center">
        <Column maxWidth="s">
          <Flex fillWidth horizontal="end" paddingBottom="m" gap="m">
            <Skeleton
              shape="block"
              width="xl"
              height="xl"
              style={{ width: "200px", height: "200px", borderRadius: "8px" }}
            />
            <Skeleton
              shape="line"
              width="xl"
              height="l"
              style={{ width: "300px" }}
            />
          </Flex>
          <Flex fillWidth horizontal="start" paddingBottom="m">
            <Skeleton
              shape="line"
              width="l"
              height="m"
              style={{ width: "450px" }}
            />
          </Flex>
          <Flex horizontal="start">
            <Skeleton
              shape="block"
              width="m"
              height="s"
              style={{ width: "150px", height: "40px", borderRadius: "20px" }}
            />
          </Flex>
        </Column>
      </Column>
    </Column>
  );
};
