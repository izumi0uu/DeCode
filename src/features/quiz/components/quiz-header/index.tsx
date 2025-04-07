// components/QuizHeader.tsx
import React from "react";
import { Flex, Text } from "@/once-ui/components";
import Timer from "../ui/timer";

interface QuizHeaderProps {
  quizData: any;
  timeLeft: number | null;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({ quizData, timeLeft }) => {
  return (
    <Flex
      direction="column"
      gap="m"
      style={{
        background:
          "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Flex style={{ justifyContent: "space-between", alignItems: "center" }}>
        <Flex direction="column" gap="xs">
          <Text
            variant="heading-strong-l"
            style={{
              background: "linear-gradient(90deg, #3366FF, #00CCFF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0px 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            {quizData.title}
          </Text>
          {quizData.description && (
            <Text variant="body-default-l" style={{ marginTop: "8px" }}>
              {quizData.description}
            </Text>
          )}
        </Flex>
        {timeLeft !== null && <Timer timeLeft={timeLeft} />}
      </Flex>

      <Flex
        gap="s"
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            color: "var(--color-light)",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          Updated: {new Date(quizData.updatedAt).toLocaleDateString()}
        </div>
        {quizData.passingScore && (
          <div
            style={{
              background: "rgba(76, 175, 80, 0.1)",
              color: "var(--color-success)",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            Passing: {quizData.passingScore}%
          </div>
        )}
      </Flex>
    </Flex>
  );
};

export default QuizHeader;
