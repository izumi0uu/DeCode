// features/quiz/components/quiz-results/quiz-result-layout.tsx
"use client";

import { motion } from "framer-motion";
import { Flex, Heading } from "@/once-ui/components";
import { ReactNode } from "react";

interface ResultLayoutProps {
  children: ReactNode;
}

export const ResultLayout: React.FC<ResultLayoutProps> = ({ children }) => {
  return (
    <Flex
      direction="column"
      style={{
        maxWidth: "800px",
        width: "100%",
        margin: "0 auto",
        padding: "16px",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgba(25, 29, 59, 0.9) 0%, rgba(10, 12, 32, 1) 100%)",
      }}
      center
      align="center"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ width: "100%", textAlign: "center", marginBottom: "24px" }}
      >
        <Heading as="h1" size="xl">
          Quiz Result
        </Heading>
      </motion.div>

      {children}
    </Flex>
  );
};
