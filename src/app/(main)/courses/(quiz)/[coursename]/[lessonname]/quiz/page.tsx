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
  type RadioButtonProps,
} from "@/once-ui/components";
import { useGetLessonQuizDetailed } from "@/features/quiz/api/use-get-lesson-quiz";
import { QuestionType } from "@/features/types/api/quiz-question";
import CheckboxGroup from "./CheckboxGroup";

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

// 更新类型定义
interface RadioButtonWithValueProps extends Omit<RadioButtonProps, "onToggle"> {
  value: string;
  onToggle?: () => void;
}

interface RadioGroupProps {
  name: string;
  selectedValue: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

// 更新 RadioGroup 组件
const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  selectedValue,
  onChange,
  children,
}) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<RadioButtonWithValueProps>(child)) {
      return React.cloneElement(child, {
        name,
        isChecked: child.props.value === selectedValue,
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
  const [userAnswers, setUserAnswers] = useState<
    Record<number, string | string[]>
  >({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // 使用我们创建的 hook 获取测验数据
  const { data: quizData, isLoading } = useGetLessonQuizDetailed(lessonname);

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

  // 更新答案处理函数
  const handleAnswerChange = (
    questionId: number,
    answer: string | string[]
  ) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // 更新答案验证函数
  const validateAnswers = () => {
    const errors: string[] = [];
    if (!quizData?.questions) return errors;

    quizData.questions.forEach((question) => {
      const answer = userAnswers[question.id];
      if (!answer) {
        errors.push(`请回答第 ${question.id} 题`);
      } else if (question.type === QuestionType.MULTIPLE_CHOICE) {
        if (!Array.isArray(answer) || answer.length === 0) {
          errors.push(`请选择第 ${question.id} 题的答案`);
        }
      } else if (typeof answer !== "string" || answer.trim() === "") {
        errors.push(`请选择第 ${question.id} 题的答案`);
      }
    });
    return errors;
  };

  // 更新提交测验函数
  const handleSubmitQuiz = async () => {
    const errors = validateAnswers();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    const formattedAnswers = Object.entries(userAnswers).map(
      ([questionId, answer]) => ({
        questionId: parseInt(questionId, 10),
        answer: Array.isArray(answer) ? answer.join(",") : answer,
      })
    );

    try {
      // ... 提交逻辑 ...
      setQuizSubmitted(true);
      if (quizData) {
        const score = calculateScore();
        const passed = score >= quizData.passingScore;
        console.log("Quiz submitted with score:", score, "Passed:", passed);
      }
    } catch (error) {
      console.error("提交测验失败:", error);
    }
  };

  // 更新计算分数函数
  const calculateScore = () => {
    if (!quizData?.questions) return 0;

    let totalScore = 0;
    quizData.questions.forEach((question) => {
      const userAnswer = userAnswers[question.id];
      if (!userAnswer) return;

      if (question.type === QuestionType.MULTIPLE_CHOICE) {
        if (Array.isArray(userAnswer)) {
          const correctAnswers = question.options
            .filter((option: any) => option.isCorrect)
            .map((option: any) => option.id.toString());

          const isCorrect =
            userAnswer.length === correctAnswers.length &&
            userAnswer.every((answer) => correctAnswers.includes(answer));

          if (isCorrect) {
            totalScore += question.points || 1;
          }
        }
      } else {
        const correctAnswer = question.options
          .find((option: any) => option.isCorrect)
          ?.id.toString();

        if (userAnswer === correctAnswer) {
          totalScore += question.points || 1;
        }
      }
    });

    return totalScore;
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
              name={`question-${question.id}`}
              selectedValue={
                Array.isArray(userAnswers[question.id])
                  ? ""
                  : userAnswers[question.id]?.toString() || ""
              }
              onChange={(value: string) =>
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
            <CheckboxGroup
              value={
                Array.isArray(userAnswers[question.id])
                  ? (userAnswers[question.id] as string[])
                  : []
              }
              onChange={(newAnswers: string[]) =>
                handleAnswerChange(question.id, newAnswers)
              }
            >
              <Flex direction="column" gap="m">
                {question.options.map((option: any) => (
                  <Checkbox
                    key={option.id}
                    value={option.id.toString()}
                    label={option.text}
                  />
                ))}
              </Flex>
            </CheckboxGroup>
          )}

          {question.type === QuestionType.TRUE_FALSE && (
            <RadioGroup
              name={`question-${question.id}`}
              selectedValue={
                Array.isArray(userAnswers[question.id])
                  ? ""
                  : userAnswers[question.id]?.toString() || ""
              }
              onChange={(value: string) =>
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

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <Text variant="heading-strong-l">{quizData.title}</Text>
        {quizData.description && (
          <Text variant="body-default-l" style={{ marginTop: "8px" }}>
            {quizData.description}
          </Text>
        )}
        {timeLeft !== null && (
          <Text variant="body-strong-m" style={{ marginTop: "16px" }}>
            剩余时间: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </Text>
        )}
      </div>

      {validationErrors.length > 0 && (
        <Card
          padding="m"
          style={{ marginBottom: "20px", backgroundColor: "#FFF3F3" }}
        >
          <Flex direction="column" gap="s">
            {validationErrors.map((error, index) => (
              <Text key={index} variant="body-default-m" color="error">
                {error}
              </Text>
            ))}
          </Flex>
        </Card>
      )}

      {quizSubmitted ? renderQuizResults() : renderCurrentQuestion()}

      {!quizSubmitted && (
        <Flex horizontal="center" style={{ marginTop: "24px" }}>
          <Button
            variant="primary"
            onClick={handleSubmitQuiz}
            disabled={quizSubmitted}
          >
            提交测验
          </Button>
        </Flex>
      )}
    </div>
  );
}
