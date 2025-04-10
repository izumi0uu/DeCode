"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useParams } from "next/navigation";
import { Flex, Text, Card, Box, Heading, Button } from "@/once-ui/components";
import { Bubble, XStream } from "@ant-design/x";
import { useXStream } from "@ant-design/x";
import { useGetLessonContent } from "@/features/lesson/api/use-get-lesson";
import {
  useGetQuizAnswers,
  useGetAIPromptTemplate,
} from "@/features/quiz/api/use-get-quiz-option-answer";
import { QuestionType } from "@/features/types/api/quiz-question";
import Loading from "./loading";

// 常规题目答案组件
const RegularQuestionResult = ({ question, userAnswer, correctAnswer }) => {
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
        <Heading as="h3" size="md">
          {question.title}
        </Heading>
        <Text size="sm">
          您的答案:{" "}
          {Array.isArray(userAnswer)
            ? userAnswer.join(", ")
            : userAnswer || "未作答"}
        </Text>
        <Text size="sm">
          正确答案:{" "}
          {isMultipleChoice ? correctAnswer.join(", ") : correctAnswer}
        </Text>
        <Text weight="bold" color={isCorrect ? "green" : "red"}>
          {isCorrect ? "✓ 正确" : "✗ 错误"}
        </Text>
      </Flex>
    </Card>
  );
};

// 代码题目答案组件
const CodeQuestionResult = ({ question, userAnswer, quizId }) => {
  const [streamStarted, setStreamStarted] = useState(false);
  const [streamUrl, setStreamUrl] = useState(null);

  // 获取AI提示模板
  const { data: promptTemplate, isLoading: promptLoading } =
    useGetAIPromptTemplate(quizId);

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
    }
  };

  useEffect(() => {
    if (promptTemplate && userAnswer && !streamStarted) {
      startStream();
    }
  }, [promptTemplate, userAnswer, streamStarted]);

  // 使用XStream处理流数据
  const { data, status } = useXStream(streamUrl);

  const actualContent =
    typeof data === "string" ? data : data?.content || "正在生成AI反馈...";

  return (
    <Card padding="4" margin="2">
      <Flex direction="column" gap="4">
        <Heading as="h3" size="md">
          {question.title}
        </Heading>

        <Box padding="4" background="surface-neutral">
          <Text size="sm" family="mono" whiteSpace="pre-wrap">
            {Array.isArray(userAnswer)
              ? userAnswer.join("\n")
              : userAnswer || "未提交代码"}
          </Text>
        </Box>

        <Heading as="h4" size="sm">
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
  const { lessonname, coursename } = params;

  // 获取课程和章节信息
  const { data: lessonData, isLoading: lessonLoading } = useGetLessonContent(
    lessonname as string
  );

  // 获取测验和正确答案
  const { data: quizData, isLoading: quizLoading } = useGetQuizAnswers(
    lessonname as string
  );

  // 本地保存的答案
  const [userAnswers, setUserAnswers] = useState<
    Record<number, string | string[]>
  >({});

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

  if (lessonLoading || quizLoading) {
    return <Loading />;
  }

  if (!quizData) {
    return (
      <Flex direction="column" align="center" padding="8">
        <Text>无法加载测验结果</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" maxWidth="800px" margin="0 auto" padding="4">
      <Heading as="h1" size="xl" margin="4 0">
        {lessonData?.currentCourse?.title}: {lessonData?.currentLesson?.title} -
        测验结果
      </Heading>

      <Flex direction="column" gap="6">
        {quizData.attributes?.questions.map((question) => {
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
            .filter((opt) => opt.isCorrect)
            .map((opt) => opt.id.toString());

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

      {/* 导航按钮 */}
      <Flex justify="space-between" margin="8 0">
        <Button
          variant="secondary"
          onClick={() =>
            (window.location.href = `/courses/${coursename}/${lessonname}`)
          }
        >
          返回课程
        </Button>

        {lessonData?.nextLesson && (
          <Button
            variant="primary"
            onClick={() =>
              (window.location.href = `/courses/${coursename}/${lessonData.nextLesson.slug}`)
            }
          >
            下一课
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
