"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { Flex, Text, Heading, Button, Skeleton } from "@/once-ui/components";
import { Bubble } from "@ant-design/x";
import { motion, AnimatePresence } from "framer-motion";
import { useGetQuizAnswers } from "@/features/quiz/api/use-get-quiz-option-answer";
import { useGetAIPromptTemplate } from "@/features/quiz/api/use-get-ai-prompt";
import { QuestionType } from "@/features/types/api/quiz-question";
import Loading from "./loading";

// 定义类型
type UserAnswers = Record<string, string | string[]>;

interface StreamState {
  data: { content: string } | string | null;
  status: "idle" | "loading" | "success" | "error";
}

interface RegularQuestionResultProps {
  question: {
    id: string;
    title: string;
    type: string;
    options: Array<{
      id: string;
      isCorrect: boolean;
    }>;
  };
  userAnswer: string | string[] | undefined;
  correctAnswer: string | string[];
  index: number;
}

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

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const pulseAnimation = {
  scale: [1, 1.02, 1],
  boxShadow: [
    "0 0 0 rgba(32, 128, 255, 0)",
    "0 0 20px rgba(32, 128, 255, 0.5)",
    "0 0 0 rgba(32, 128, 255, 0)",
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "loop" as "loop",
  },
};

// 骨架屏加载状态组件
const ResultLoading = () => (
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

// 常规题目答案组件
const RegularQuestionResult: React.FC<RegularQuestionResultProps> = ({
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
      style={{
        background: isCorrect
          ? "linear-gradient(135deg, rgba(0, 180, 120, 0.1) 0%, rgba(15, 25, 60, 0.8) 100%)"
          : "linear-gradient(135deg, rgba(220, 50, 50, 0.1) 0%, rgba(15, 25, 60, 0.8) 100%)",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      }}
    >
      <Flex direction="column" gap="2" style={{ width: "100%" }}>
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
            <Text weight="strong">选项：</Text>
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
                      }}
                    >
                      Correct Answer
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
        <motion.div animate={isCorrect ? pulseAnimation : {}}>
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

// 流式数据处理钩子
const useStream = (url: string | null): StreamState => {
  const [state, setState] = useState<StreamState>({
    data: null,
    status: "idle",
  });

  useEffect(() => {
    if (!url) return;

    let isMounted = true;
    setState((prev) => ({ ...prev, status: "loading" }));

    // 使用实际的流处理
    const processStream = async () => {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Stream request failed: ${response.status}`);
        }

        // 确保响应支持流处理
        if (!response.body) {
          throw new Error("Response body is null");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          // 解码和处理数据块
          const chunk = decoder.decode(value, { stream: true });
          result += chunk;

          // 更新状态
          if (isMounted) {
            setState({
              data: { content: result },
              status: "success",
            });
          }
        }
      } catch (error) {
        console.error("Stream processing error:", error);
        if (isMounted) {
          setState((prev) => ({ ...prev, status: "error" }));
        }
      }
    };

    processStream();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return state;
};

// 代码题目答案组件
const CodeQuestionResult: React.FC<CodeQuestionResultProps> = ({
  question,
  userAnswer,
  quizId,
  index,
}) => {
  const [streamStarted, setStreamStarted] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  // 获取AI提示模板
  const { data: promptTemplate, isLoading: promptLoading } =
    useGetAIPromptTemplate(Number(quizId));

  // 初始化流
  const startStream = async () => {
    if (streamStarted || !userAnswer || !promptTemplate) return;

    setStreamStarted(true);

    try {
      const response = await fetch("/api/ai-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptTemplate,
          code: Array.isArray(userAnswer) ? userAnswer.join("\n") : userAnswer,
          questionId: question.id,
        }),
      });

      if (!response.ok) throw new Error("Stream request failed");

      // 设置流URL
      setStreamUrl(response.url);
    } catch (err) {
      console.error("启动流失败:", err);
      setStreamStarted(false);
    }
  };

  useEffect(() => {
    if (promptTemplate && userAnswer && !streamStarted) {
      startStream();
    }
  }, [promptTemplate, userAnswer, streamStarted]);

  // 使用指定格式处理流数据
  const { data, status } = useStream(streamUrl);

  const actualContent =
    typeof data === "string" ? data : data?.content || "正在生成AI反馈...";

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
      <Flex direction="column" gap="4">
        <Heading as="h3" size="m">
          {question.title}
        </Heading>

        <div
          style={{
            padding: "16px",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            border: "1px solid rgba(100, 100, 100, 0.2)",
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

// 分数汇总组件
const ScoreSummary = ({
  score,
  totalScore,
}: {
  score: number;
  totalScore: number;
}) => {
  const percentage = Math.round((score / totalScore) * 100);
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

// 主结果页面组件
export default function QuizResultPage() {
  const params = useParams();
  const router = useRouter();
  const lessonname = params.lessonname as string;
  const coursename = params.coursename as string;

  // 获取测验和正确答案
  const { data: quizData, isLoading: quizLoading } =
    useGetQuizAnswers(lessonname);

  // 本地保存的答案
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    // 从本地存储获取用户提交的答案
    const savedAnswers = localStorage.getItem(`quiz_answers_${lessonname}`);
    if (savedAnswers) {
      try {
        setUserAnswers(JSON.parse(savedAnswers));
      } catch (e) {
        console.error("Failed to parse local storage answers:", e);
      }
    }
  }, [lessonname]);

  // 计算得分
  useEffect(() => {
    if (quizData && Object.keys(userAnswers).length > 0) {
      let correctCount = 0;
      const totalQuestions = quizData.questions.length;

      quizData.questions.forEach((question: any) => {
        if (question.type !== QuestionType.PROGRAMMING) {
          const userAnswer = userAnswers[question.id];
          const correctAnswer = question.options
            .filter((opt: any) => opt.isCorrect)
            .map((opt: any) => opt.id.toString());

          const isMultipleChoice = correctAnswer.length > 1;
          const isCorrect = isMultipleChoice
            ? Array.isArray(userAnswer) &&
              userAnswer.length === correctAnswer.length &&
              userAnswer.every((a) => correctAnswer.includes(a))
            : userAnswer === correctAnswer[0];

          if (isCorrect) correctCount++;
        }
      });

      setScore({
        correct: correctCount,
        total: totalQuestions,
      });
    }
  }, [quizData, userAnswers]);

  if (quizLoading) {
    return <Loading />;
  }

  if (!quizData) {
    return (
      <Flex direction="column" align="center" padding="8">
        <Text>Failed to load quiz results</Text>
      </Flex>
    );
  }

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

      {/* 分数汇总 */}
      <ScoreSummary score={score.correct} totalScore={score.total} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          width: "100%",
          marginTop: "32px",
          gap: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {quizData.questions.map((question: any, index: number) => {
          const userAnswer = userAnswers[question.id];

          if (question.type === QuestionType.PROGRAMMING) {
            return (
              <Suspense key={question.id} fallback={<ResultLoading />}>
                <CodeQuestionResult
                  question={question}
                  userAnswer={userAnswer}
                  quizId={quizData.id}
                  index={index}
                />
              </Suspense>
            );
          }

          const correctAnswer = question.options
            .filter((opt: any) => opt.isCorrect)
            .map((opt: any) => opt.id.toString());

          return (
            <Suspense key={question.id} fallback={<ResultLoading />}>
              <RegularQuestionResult
                question={question}
                userAnswer={userAnswer}
                correctAnswer={
                  correctAnswer.length === 1 ? correctAnswer[0] : correctAnswer
                }
                index={index}
              />
            </Suspense>
          );
        })}
      </motion.div>

      {/* 导航按钮 - 使用浏览器历史栈 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{ width: "100%", margin: "32px 0" }}
      >
        <Flex style={{ justifyContent: "space-between" }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="secondary"
              onClick={() => router.back()}
              style={{
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                background: "rgba(50, 60, 150, 0.2)",
                color: "#fff",
                border: "1px solid rgba(100, 150, 255, 0.3)",
              }}
            >
              Return
            </Button>
          </motion.div>
        </Flex>
      </motion.div>
    </Flex>
  );
}
