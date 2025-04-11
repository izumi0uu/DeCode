"use client";

import { motion } from "framer-motion";
import { Flex, Text, Heading } from "@/once-ui/components";
import { pulseAnimation } from "@/features/quiz/constants/animation";

interface RegularQuestionResultProps {
  question: {
    id: string;
    title: string;
    type: string;
    options: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
    }>;
  };
  userAnswer: string | string[] | undefined;
  correctAnswer: string | string[];
  index: number;
}

export const RegularQuestionResult: React.FC<RegularQuestionResultProps> = ({
  question,
  userAnswer,
  correctAnswer,
  index,
}) => {
  // 判断答案是否正确
  const isMultipleChoice = Array.isArray(correctAnswer);

  const isCorrect = isMultipleChoice
    ? Array.isArray(userAnswer) &&
      userAnswer.length === correctAnswer.length &&
      userAnswer.every((a) => correctAnswer.includes(a))
    : userAnswer === correctAnswer;

  return (
    <Flex
      padding="4"
      margin="2"
      gap="40"
      style={{
        background: isCorrect
          ? "linear-gradient(135deg, rgba(0, 180, 120, 0.1) 0%, rgba(15, 25, 60, 0.8) 100%)"
          : "linear-gradient(135deg, rgba(220, 50, 50, 0.1) 0%, rgba(15, 25, 60, 0.8) 100%)",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        width: "100%",
      }}
    >
      <Flex direction="column" gap="8" style={{ width: "100%" }}>
        <Heading as="h3" size="m">
          {index + 1}. {question.question || question.title}
        </Heading>

        {/* 所有选项展示 */}
        {question.options && question.options.length > 0 && (
          <Flex
            direction="column"
            gap="2"
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              padding: "12px",
              borderRadius: "8px",
              marginTop: "8px",
            }}
          >
            <Text weight="strong">Options:</Text>
            {question.options.map((option: any) => {
              const isUserSelected = Array.isArray(userAnswer)
                ? userAnswer.includes(option.id.toString())
                : userAnswer === option.id.toString();

              const isCorrectOption = Array.isArray(correctAnswer)
                ? correctAnswer.includes(option.id.toString())
                : correctAnswer === option.id.toString();

              return (
                <Flex
                  key={option.id}
                  align="center"
                  gap="2"
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    background: isUserSelected
                      ? isCorrectOption
                        ? "rgba(0, 180, 120, 0.1)"
                        : "rgba(220, 50, 50, 0.1)"
                      : isCorrectOption
                      ? "rgba(0, 180, 120, 0.05)"
                      : "transparent",
                    border: isUserSelected
                      ? isCorrectOption
                        ? "1px solid rgba(0, 180, 120, 0.3)"
                        : "1px solid rgba(220, 50, 50, 0.3)"
                      : isCorrectOption
                      ? "1px dashed rgba(0, 180, 120, 0.3)"
                      : "1px solid rgba(100, 100, 100, 0.2)",
                    position: "relative",
                  }}
                >
                  <Text style={{ flex: 1 }}>{option.text}</Text>
                  {isUserSelected && (
                    <Text
                      color={isCorrectOption ? "green" : "red"}
                      weight="strong"
                      style={{
                        fontSize: "0.8rem",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: isCorrectOption
                          ? "rgba(0, 180, 120, 0.2)"
                          : "rgba(220, 50, 50, 0.2)",
                        position: "absolute",
                      }}
                    >
                      {isCorrectOption ? "Right" : "Wrong"}
                    </Text>
                  )}
                  {!isUserSelected && isCorrectOption && (
                    <Text
                      color="green"
                      weight="strong"
                      style={{
                        fontSize: "0.8rem",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: "rgba(0, 180, 120, 0.2)",
                        position: "absolute",
                      }}
                    >
                      Right
                    </Text>
                  )}
                </Flex>
              );
            })}
          </Flex>
        )}

        <Flex
          style={{
            background: "rgba(0, 0, 0, 0.2)",
            padding: "12px",
            borderRadius: "8px",
            marginTop: "8px",
          }}
          direction="column"
          gap="2"
        >
          <Text>
            Your Answer:{" "}
            <span style={{ fontWeight: "bold" }}>
              {Array.isArray(userAnswer)
                ? userAnswer.length > 0
                  ? question.options
                      .filter((opt: any) =>
                        userAnswer.includes(opt.id.toString())
                      )
                      .map((opt: any) => opt.text)
                      .join(", ")
                  : "No Answer"
                : userAnswer
                ? question.options.find(
                    (opt: any) => opt.id.toString() === userAnswer
                  )?.text || "No Answer"
                : "No Answer"}
            </span>
          </Text>
          <Text>
            Correct Answer:{" "}
            <span style={{ fontWeight: "bold" }}>
              {isMultipleChoice
                ? question.options
                    .filter((opt: any) =>
                      correctAnswer.includes(opt.id.toString())
                    )
                    .map((opt: any) => opt.text)
                    .join(", ")
                : question.options.find(
                    (opt: any) => opt.id.toString() === correctAnswer
                  )?.text || "No Answer"}
            </span>
          </Text>
        </Flex>
        <motion.div
          animate={isCorrect ? pulseAnimation : {}}
          style={{ borderRadius: "10px" }}
        >
          <Text
            weight="strong"
            color={isCorrect ? "green" : "red"}
            style={{
              display: "inline-block",
              padding: "8px 16px",
              background: isCorrect
                ? "rgba(0, 180, 120, 0.2)"
                : "rgba(220, 50, 50, 0.2)",
              borderRadius: "20px",
              fontSize: "0.9rem",
            }}
          >
            {isCorrect ? "Right" : "Wrong"}
          </Text>
        </motion.div>
      </Flex>
    </Flex>
  );
};
