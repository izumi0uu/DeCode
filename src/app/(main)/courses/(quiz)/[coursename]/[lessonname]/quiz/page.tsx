"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Flex,
  Text,
  Button,
  Checkbox,
  Card,
  RadioButton,
  Input,
} from "@/once-ui/components";
import { useQuery } from "@tanstack/react-query";
import { QuestionType } from "@/features/types/api/quiz-question";

interface PageProps {
  params: {
    coursename: string;
    lessonname: string;
  };
}

// 自定义Progress组件
const Progress: React.FC<{
  value: number;
  max: number;
  size: string;
  status: string;
}> = ({ value, max, size, status }) => {
  const percentage = (value / max) * 100;
  return (
    <div
      style={{
        width: "100%",
        height: size === "l" ? "12px" : "8px",
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: "6px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: "100%",
          backgroundColor: status === "success" ? "#4CAF50" : "#F44336",
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
};

// 定义RadioButtonProps的类型，以便在RadioGroup中使用
interface RadioButtonWithValueProps {
  value: string;
  key?: React.Key;
  label?: string;
  isChecked?: boolean;
  onToggle?: () => void;
}

// 自定义RadioGroup实现
const RadioGroup: React.FC<{
  value: string | number;
  onChange: (value: string | number) => void;
  children: React.ReactNode;
}> = ({ value, onChange, children }) => {
  // 克隆子元素并传递value和onChange
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<RadioButtonWithValueProps>(child)) {
      return React.cloneElement(child, {
        isChecked: child.props.value === value,
        onToggle: () => onChange(child.props.value),
      });
    }
    return child;
  });

  return <>{childrenWithProps}</>;
};

export default function QuizPage({ params }: PageProps) {
  const router = useRouter();
  const { coursename, lessonname } = params;

  // 状态管理
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // 获取测验数据
  const { data: quizData, isLoading } = useQuery({
    queryKey: ["quiz", coursename, lessonname],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/quizzes?lessonSlug=${lessonname}`);
        if (!response.ok) {
          throw new Error("Failed to fetch quiz data");
        }
        return response.json();
      } catch (error) {
        console.error("Error fetching quiz:", error);
        throw error;
      }
    },
  });

  // 设置计时器
  useEffect(() => {
    if (quizData?.timeLimit) {
      setTimeLeft(quizData.timeLimit * 60); // 转换为秒

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timer);
            // 自动提交
            if (!quizSubmitted) {
              handleSubmitQuiz();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizData, quizSubmitted]);

  // 格式化时间
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // 处理答案变更
  const handleAnswerChange = (questionId: number, answer: any) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // 提交测验
  const handleSubmitQuiz = async () => {
    try {
      // 这里可以添加提交到API的逻辑
      setQuizSubmitted(true);

      // 模拟提交后的结果计算
      if (quizData) {
        const score = calculateScore();
        const passed = score >= quizData.passingScore;

        // 可以保存结果或直接展示
        console.log("Quiz submitted with score:", score, "Passed:", passed);

        // 可以跳转到结果页面
        // router.push(`/courses/${coursename}/${lessonname}/quiz/result`);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  // 计算分数
  const calculateScore = () => {
    if (!quizData?.questions) return 0;

    let totalPoints = 0;
    let earnedPoints = 0;

    quizData.questions.forEach((question: any) => {
      totalPoints += question.points;

      const userAnswer = userAnswers[question.id];
      if (!userAnswer) return;

      if (
        question.type === QuestionType.SINGLE_CHOICE ||
        question.type === QuestionType.TRUE_FALSE
      ) {
        // 单选题
        const correctOption = question.options.find(
          (opt: any) => opt.isCorrect
        );
        if (correctOption && userAnswer === correctOption.id) {
          earnedPoints += question.points;
        }
      } else if (question.type === QuestionType.MULTIPLE_CHOICE) {
        // 多选题
        const correctOptions = question.options
          .filter((opt: any) => opt.isCorrect)
          .map((opt: any) => opt.id);
        const allCorrect =
          correctOptions.length === userAnswer.length &&
          correctOptions.every((id: number) => userAnswer.includes(id));
        if (allCorrect) {
          earnedPoints += question.points;
        }
      } else if (question.type === QuestionType.SHORT_ANSWER) {
        // 简答题 - 实际项目中可能需要更复杂的评分逻辑
        const correctOption = question.options.find(
          (opt: any) => opt.isCorrect
        );
        if (
          correctOption &&
          userAnswer.toLowerCase() === correctOption.text.toLowerCase()
        ) {
          earnedPoints += question.points;
        }
      }
    });

    return Math.round((earnedPoints / totalPoints) * 100);
  };

  // 渲染当前问题
  const renderCurrentQuestion = () => {
    if (!quizData?.questions || quizData.questions.length === 0) {
      return (
        <Card padding="xl">
          <Text variant="body-default-m">没有可用的问题</Text>
        </Card>
      );
    }

    const question = quizData.questions[currentQuestionIndex];

    return (
      <Card padding="xl" style={{ marginBottom: "20px" }}>
        <Flex direction="column" gap="l">
          <Flex
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Text variant="heading-strong-s">
              问题 {currentQuestionIndex + 1} / {quizData.questions.length}
            </Text>
            <Text variant="body-strong-m">{question.points} 分</Text>
          </Flex>

          <Text variant="body-strong-l" style={{ marginBottom: "16px" }}>
            {question.question}
          </Text>

          {/* 根据问题类型渲染不同的答题控件 */}
          {question.type === QuestionType.SINGLE_CHOICE && (
            <RadioGroup
              value={userAnswers[question.id] || ""}
              onChange={(value: string | number) =>
                handleAnswerChange(question.id, value)
              }
            >
              <Flex direction="column" gap="m">
                {question.options.map((option: any) => (
                  <RadioButton
                    key={option.id}
                    value={option.id.toString()}
                    label={option.text}
                  />
                ))}
              </Flex>
            </RadioGroup>
          )}

          {question.type === QuestionType.MULTIPLE_CHOICE && (
            <Flex direction="column" gap="m">
              {question.options.map((option: any) => (
                <Checkbox
                  key={option.id}
                  checked={(userAnswers[question.id] || []).includes(option.id)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const currentAnswers = userAnswers[question.id] || [];
                    let newAnswers;
                    if (e.target.checked) {
                      newAnswers = [...currentAnswers, option.id];
                    } else {
                      newAnswers = currentAnswers.filter(
                        (id: number) => id !== option.id
                      );
                    }
                    handleAnswerChange(question.id, newAnswers);
                  }}
                >
                  {option.text}
                </Checkbox>
              ))}
            </Flex>
          )}

          {question.type === QuestionType.TRUE_FALSE && (
            <RadioGroup
              value={userAnswers[question.id] || ""}
              onChange={(value: string | number) =>
                handleAnswerChange(question.id, value)
              }
            >
              <Flex direction="column" gap="m">
                {question.options.map((option: any) => (
                  <RadioButton
                    key={option.id}
                    value={option.id.toString()}
                    label={option.text}
                  />
                ))}
              </Flex>
            </RadioGroup>
          )}

          {question.type === QuestionType.SHORT_ANSWER && (
            <Input
              id={`question-${question.id}`}
              label="你的答案"
              value={userAnswers[question.id] || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleAnswerChange(question.id, e.target.value)
              }
              placeholder="请输入你的答案"
            />
          )}
        </Flex>
      </Card>
    );
  };

  // 渲染测验结果
  const renderQuizResults = () => {
    if (!quizData) return null;

    const score = calculateScore();
    const passed = score >= quizData.passingScore;

    return (
      <Card padding="xl">
        <Flex direction="column" gap="l" style={{ alignItems: "center" }}>
          <Text variant="heading-strong-l">测验结果</Text>

          <div style={{ width: "100%", maxWidth: "200px" }}>
            <Progress
              value={score}
              max={100}
              size="l"
              status={passed ? "success" : "error"}
            />
          </div>

          <Text
            variant="heading-strong-xl"
            color={passed ? "success" : "error"}
          >
            {score}%
          </Text>

          <Text variant="body-strong-l">
            {passed ? "恭喜，你已通过测验！" : "很遗憾，你未能通过测验。"}
          </Text>

          <Text variant="body-default-m">
            及格分数: {quizData.passingScore}%
          </Text>

          <Flex gap="m">
            <Button
              variant="secondary"
              onClick={() =>
                router.push(`/courses/${coursename}/${lessonname}`)
              }
            >
              返回课程
            </Button>

            {!passed && (
              <Button
                variant="primary"
                onClick={() => {
                  setQuizSubmitted(false);
                  setUserAnswers({});
                  setCurrentQuestionIndex(0);
                  if (quizData.timeLimit) {
                    setTimeLeft(quizData.timeLimit * 60);
                  }
                }}
              >
                重新测验
              </Button>
            )}
          </Flex>
        </Flex>
      </Card>
    );
  };

  // 加载状态
  if (isLoading) {
    return (
      <Flex
        direction="column"
        padding="xl"
        style={{
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
        }}
      >
        <Text variant="body-strong-l">加载测验中...</Text>
      </Flex>
    );
  }

  // 数据不存在
  if (!quizData) {
    return (
      <Flex
        direction="column"
        padding="xl"
        style={{
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
        }}
      >
        <Text variant="heading-strong-m" color="error">
          测验未找到
        </Text>
        <Text variant="body-default-m" style={{ marginTop: "16px" }}>
          该课程可能还没有相关的测验，或者测验数据加载失败。
        </Text>
        <Button
          variant="secondary"
          onClick={() => router.push(`/courses/${coursename}/${lessonname}`)}
          style={{ marginTop: "24px" }}
        >
          返回课程
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      padding="xl"
      style={{ maxWidth: "800px", margin: "0 auto" }}
    >
      {/* 测验头部 */}
      <Flex
        direction="column"
        style={{
          marginBottom: "32px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: "24px",
        }}
      >
        <Text variant="heading-strong-l" style={{ marginBottom: "8px" }}>
          {quizData.title}
        </Text>

        <Text variant="body-default-m" style={{ marginBottom: "16px" }}>
          {quizData.description}
        </Text>

        <Flex style={{ justifyContent: "space-between", alignItems: "center" }}>
          <Text variant="body-strong-m">
            通过分数: {quizData.passingScore}%
          </Text>

          {timeLeft !== null && (
            <Text
              variant="body-strong-m"
              color={timeLeft < 60 ? "error" : undefined}
            >
              剩余时间: {formatTime(timeLeft)}
            </Text>
          )}
        </Flex>
      </Flex>

      {/* 测验内容 */}
      {!quizSubmitted ? (
        <>
          {renderCurrentQuestion()}

          {/* 导航按钮 */}
          <Flex style={{ justifyContent: "space-between", marginTop: "24px" }}>
            <Button
              variant="secondary"
              disabled={currentQuestionIndex === 0}
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
            >
              上一题
            </Button>

            {currentQuestionIndex < (quizData.questions?.length || 0) - 1 ? (
              <Button
                variant="primary"
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              >
                下一题
              </Button>
            ) : (
              <Button variant="primary" onClick={handleSubmitQuiz}>
                提交测验
              </Button>
            )}
          </Flex>

          {/* 问题导航 */}
          <Flex style={{ marginTop: "32px", flexWrap: "wrap", gap: "8px" }}>
            {quizData.questions?.map((question: any, index: number) => (
              <Button
                key={index}
                variant={
                  index === currentQuestionIndex
                    ? "primary"
                    : userAnswers[question.id]
                    ? "secondary"
                    : "tertiary"
                }
                size="s"
                onClick={() => setCurrentQuestionIndex(index)}
                style={{
                  minWidth: "40px",
                  height: "40px",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {index + 1}
              </Button>
            ))}
          </Flex>
        </>
      ) : (
        renderQuizResults()
      )}
    </Flex>
  );
}
