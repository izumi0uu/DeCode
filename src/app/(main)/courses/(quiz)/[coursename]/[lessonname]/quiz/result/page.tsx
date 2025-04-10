"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Flex,
  Text,
  Card,
  Heading,
  Button,
  Skeleton,
} from "@/once-ui/components";
import { Bubble } from "@ant-design/x";
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
}

interface CodeQuestionResultProps {
  question: {
    id: string;
    title: string;
    type: string;
  };
  userAnswer: string | string[] | undefined;
  quizId: string | number;
}

// 骨架屏加载状态组件
const ResultLoading = () => (
  <Card padding="4" margin="2">
    <Flex direction="column" gap="4">
      <Skeleton shape="line" width="l" />
      <Skeleton shape="line" width="m" />
      <Skeleton shape="line" width="m" />
      <Skeleton shape="line" width="s" />
    </Flex>
  </Card>
);

// 常规题目答案组件
const RegularQuestionResult: React.FC<RegularQuestionResultProps> = ({
  question,
  userAnswer,
  correctAnswer,
}) => {
  // 判断答案是否正确
  const isMultipleChoice = Array.isArray(correctAnswer);

  const isCorrect = isMultipleChoice
    ? Array.isArray(userAnswer) &&
      userAnswer.length === correctAnswer.length &&
      userAnswer.every((a) => correctAnswer.includes(a))
    : userAnswer === correctAnswer;

  return (
    <Card padding="4" margin="2">
      <Flex direction="column" gap="2">
        <Heading as="h3" size="m">
          {question.title}
        </Heading>
        <Text>
          您的答案:{" "}
          {Array.isArray(userAnswer)
            ? userAnswer.join(", ")
            : userAnswer || "未作答"}
        </Text>
        <Text>
          正确答案:{" "}
          {isMultipleChoice ? correctAnswer.join(", ") : correctAnswer}
        </Text>
        <Text weight="strong" color={isCorrect ? "green" : "red"}>
          {isCorrect ? "✓ 正确" : "✗ 错误"}
        </Text>
      </Flex>
    </Card>
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
    <Card padding="4" margin="2">
      <Flex direction="column" gap="4">
        <Heading as="h3" size="m">
          {question.title}
        </Heading>

        <div
          style={{
            padding: "16px",
            background: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <Text style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
            {Array.isArray(userAnswer)
              ? userAnswer.join("\n")
              : userAnswer || "未提交代码"}
          </Text>
        </div>

        <Heading as="h4" size="s">
          AI 代码反馈:
        </Heading>

        {promptLoading ? (
          <Text>正在准备AI分析...</Text>
        ) : !streamStarted ? (
          <Button onClick={startStream}>获取AI反馈</Button>
        ) : (
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
                  background: "#1677ff",
                }}
              />
            }
          />
        )}

        {status === "error" && (
          <Text color="red">无法获取AI反馈，请稍后重试</Text>
        )}
      </Flex>
    </Card>
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

  useEffect(() => {
    // 从本地存储获取用户提交的答案
    const savedAnswers = localStorage.getItem(`quiz_answers_${lessonname}`);
    if (savedAnswers) {
      try {
        setUserAnswers(JSON.parse(savedAnswers));
      } catch (e) {
        console.error("解析本地存储答案出错:", e);
      }
    }
  }, [lessonname]);

  if (quizLoading) {
    return <Loading />;
  }

  if (!quizData) {
    return (
      <Flex direction="column" align="center" padding="8">
        <Text>无法加载测验结果</Text>
      </Flex>
    );
  }

  console.log(quizData);

  return (
    <Flex
      direction="column"
      style={{
        maxWidth: "800px",
        width: "100%",
        margin: "0 auto",
        padding: "16px",
      }}
      center
      align="center"
    >
      <Heading as="h1" size="xl" style={{ margin: "16px 0" }}>
        Quiz Result
      </Heading>

      <Flex direction="column" style={{ gap: "24px" }}>
        {quizData.questions.map((question: any) => {
          const userAnswer = userAnswers[question.id];

          if (question.type === QuestionType.PROGRAMMING) {
            return (
              <Suspense key={question.id} fallback={<ResultLoading />}>
                <CodeQuestionResult
                  question={question}
                  userAnswer={userAnswer}
                  quizId={quizData.id}
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
              />
            </Suspense>
          );
        })}
      </Flex>

      {/* 导航按钮 - 使用浏览器历史栈 */}
      <Flex style={{ justifyContent: "space-between", margin: "32px 0" }}>
        <Button variant="secondary" onClick={() => router.back()}>
          Back to Lesson
        </Button>
      </Flex>
    </Flex>
  );
}
