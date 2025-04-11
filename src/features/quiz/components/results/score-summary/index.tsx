"use client";

import { motion } from "framer-motion";
import { Flex, Text, Heading } from "@/once-ui/components";

interface ScoreSummaryProps {
  score: number;
  totalScore: number;
}

export const ScoreSummary: React.FC<ScoreSummaryProps> = ({
  score,
  totalScore,
}) => {
  const percentage =
    totalScore > 0 ? Math.round((score / totalScore) * 100) : 0;
  const isPassed = percentage >= 60;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
    >
      <Flex
        padding="4"
        style={{
          background: isPassed
            ? "linear-gradient(135deg, rgba(0, 180, 120, 0.1) 0%, rgba(15, 25, 60, 0.8) 100%)"
            : "linear-gradient(135deg, rgba(220, 50, 50, 0.1) 0%, rgba(15, 25, 60, 0.8) 100%)",
          borderRadius: "16px",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
          border: isPassed
            ? "1px solid rgba(0, 180, 120, 0.3)"
            : "1px solid rgba(220, 50, 50, 0.3)",
        }}
      >
        <Flex
          direction="column"
          align="center"
          gap="4"
          style={{ width: "100%" }}
        >
          <Heading as="h2" size="l">
            Your Score
          </Heading>

          <Text
            style={{
              fontSize: "48px",
              fontWeight: "bold",
            }}
          >
            {score} / {totalScore}
          </Text>

          <div
            style={{
              padding: "8px 20px",
              borderRadius: "30px",
              background: isPassed
                ? "rgba(0, 180, 120, 0.2)"
                : "rgba(220, 50, 50, 0.2)",
              color: isPassed
                ? "var(--success-solid-medium)"
                : "var(--danger-solid-medium)",
              fontWeight: "bold",
              marginTop: "8px",
            }}
          >
            {isPassed ? "Passed" : "Failed"}
          </div>
        </Flex>
      </Flex>
    </motion.div>
  );
};
