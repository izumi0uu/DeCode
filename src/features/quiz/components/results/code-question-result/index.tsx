"use client";

import { motion } from "framer-motion";
import { Flex, Text, Heading, Button } from "@/once-ui/components";
import { Bubble } from "@ant-design/x";
import { useAIFeedback } from "@/features/quiz/hooks/use-ai-feedback";

interface CodeQuestionResultProps {
  question: {
    id: string;
    title: string;
    type: string;
  };
  userAnswer: string | string[] | undefined;
  quizId: string | number;
  index: number;
}

export const CodeQuestionResult: React.FC<CodeQuestionResultProps> = ({
  question,
  userAnswer,
  quizId,
  index,
}) => {
  const { promptLoading, streamStarted, startStream, actualContent, status } =
    useAIFeedback(quizId, question.id, userAnswer);

  return (
    <Flex
      padding="4"
      margin="2"
      style={{
        background:
          "linear-gradient(135deg, rgba(32, 128, 255, 0.1) 0%, rgba(10, 25, 41, 0.7) 100%)",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        width: "100%",
        flex: 1,
        flexGrow: 1,
      }}
    >
      <Flex direction="column" gap="4" style={{ width: "100%" }}>
        <Heading as="h3" size="m">
          {question.title}
        </Heading>

        <div
          style={{
            padding: "16px",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            border: "1px solid rgba(100, 100, 100, 0.2)",
            width: "100%",
          }}
        >
          <Text style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
            {Array.isArray(userAnswer)
              ? userAnswer.join("\n")
              : userAnswer || "未提交代码"}
          </Text>
        </div>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.5 }}
        >
          <Heading as="h4" size="s" style={{ marginBottom: "12px" }}>
            AI 代码反馈:
          </Heading>

          {promptLoading ? (
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                transition: { repeat: Infinity, duration: 1.5 },
              }}
            >
              <Text>正在准备AI分析...</Text>
            </motion.div>
          ) : !streamStarted ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={startStream}
                style={{ background: "var(--brand-solid-medium)" }}
              >
                获取AI反馈
              </Button>
            </motion.div>
          ) : (
            <div
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                borderRadius: "12px",
                padding: "4px",
              }}
            >
              <Bubble
                variant="filled"
                content={actualContent}
                loading={status === "loading"}
                typing={status === "success"}
                avatar={
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #3366ff 0%, #00ccff 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    AI
                  </div>
                }
              />
            </div>
          )}
        </motion.div>

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Text color="red">
              Failed to get AI feedback, please try again later
            </Text>
          </motion.div>
        )}
      </Flex>
    </Flex>
  );
};
