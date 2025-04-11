"use client";

import { motion } from "framer-motion";
import { Flex, Skeleton } from "@/once-ui/components";

export const ResultSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <Flex
      padding="4"
      margin="2"
      style={{ background: "rgba(10, 25, 41, 0.7)", borderRadius: "16px" }}
    >
      <Flex direction="column" gap="4">
        <Skeleton shape="line" width="l" />
        <Skeleton shape="line" width="m" />
        <Skeleton shape="line" width="m" />
        <Skeleton shape="line" width="s" />
      </Flex>
    </Flex>
  </motion.div>
);
