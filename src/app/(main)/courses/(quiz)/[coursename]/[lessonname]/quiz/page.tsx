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
import { useRouteParams } from "@/lib/utils/route-params";

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
        position: "relative",
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: "100%",
          backgroundColor: status === "success" ? "#4CAF50" : "#F44336",
          transition: "width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {status === "success" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)",
              animation: "shine 1.5s infinite",
            }}
          />
        )}
      </div>
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
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

// 计时器组件
const Timer: React.FC<{ timeLeft: number }> = ({ timeLeft }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isWarning = timeLeft < 300; // 少于5分钟显示警告

  return (
    <Flex
      gap="s"
      style={{
        background: isWarning
          ? "rgba(244, 67, 54, 0.1)"
          : "rgba(33, 150, 243, 0.1)",
        padding: "8px 16px",
        borderRadius: "20px",
        transition: "background 0.3s ease",
        alignItems: "center",
      }}
    >
      <span
        className="material-icons-round"
        style={{
          fontSize: "18px",
          color: isWarning ? "var(--color-error)" : "var(--color-primary)",
        }}
      >
        {isWarning ? "alarm" : "schedule"}
      </span>
      <Text
        variant="body-strong-m"
        color={isWarning ? "error" : "primary"}
        style={{
          fontVariantNumeric: "tabular-nums",
          animation: isWarning ? "pulse 1s infinite" : "none",
        }}
      >
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </Text>
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            opacity: 1;
          }
        }
        .material-icons-round {
          font-family: "Material Icons Round";
          font-weight: normal;
          font-style: normal;
          display: inline-block;
          line-height: 1;
          text-transform: none;
          letter-spacing: normal;
          word-wrap: normal;
          white-space: nowrap;
          direction: ltr;
        }
      `}</style>
    </Flex>
  );
};

// 内部组件，接收已解析的参数
function QuizContent({
  courseSlug,
  lessonSlug,
}: {
  courseSlug: string;
  lessonSlug: string;
}) {
  const router = useRouter();

  // 状态管理
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<
    Record<number, string | string[]>
  >({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 使用我们创建的 hook 获取测验数据
  const { data: quizData, isLoading: quizLoading } =
    useGetLessonQuizDetailed(lessonSlug);

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
    setValidationErrors([]);
  };

  // 更新答案验证函数
  const validateAnswers = () => {
    const errors: string[] = [];
    if (!quizData?.questions) return errors;

    quizData.questions.forEach((question) => {
      const answer = userAnswers[question.id];
      if (!answer) {
        errors.push(`Please answer question ${question.id}`);
      } else if (question.type === QuestionType.MULTIPLE_CHOICE) {
        if (!Array.isArray(answer) || answer.length === 0) {
          errors.push(
            `Please select at least one option for question ${question.id}`
          );
        }
      } else if (typeof answer !== "string" || answer.trim() === "") {
        errors.push(`Please provide an answer for question ${question.id}`);
      }
    });
    return errors;
  };

  // 导航到下一个问题
  const goToNextQuestion = () => {
    if (
      quizData?.questions &&
      currentQuestionIndex < quizData.questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // 导航到上一个问题
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // 更新提交测验函数
  const handleSubmitQuiz = async () => {
    const errors = validateAnswers();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);

    const formattedAnswers = Object.entries(userAnswers).map(
      ([questionId, answer]) => ({
        questionId: parseInt(questionId, 10),
        answer: Array.isArray(answer) ? answer.join(",") : answer,
      })
    );

    try {
      // 模拟提交延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setQuizSubmitted(true);
      if (quizData) {
        const score = calculateScore();
        const passed = score >= quizData.passingScore;
        console.log("Quiz submitted with score:", score, "Passed:", passed);
      }
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 更新计算分数函数
  const calculateScore = () => {
    if (!quizData?.questions) return 0;

    let totalScore = 0;
    let totalPoints = 0;

    quizData.questions.forEach((question) => {
      totalPoints += question.points || 1;

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

    // 计算百分比分数
    return Math.round((totalScore / totalPoints) * 100);
  };

  // 数据加载中
  if (quizLoading) {
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
        <div className="loading-spinner">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <Text variant="heading-strong-m" style={{ marginTop: "24px" }}>
          Loading Quiz...
        </Text>
        <style jsx>{`
          .loading-spinner {
            display: inline-block;
            position: relative;
            width: 80px;
            height: 80px;
          }
          .loading-spinner div {
            position: absolute;
            border: 4px solid #3366ff;
            opacity: 1;
            border-radius: 50%;
            animation: loading-spinner 1.5s cubic-bezier(0, 0.2, 0.8, 1)
              infinite;
          }
          .loading-spinner div:nth-child(2) {
            animation-delay: -0.5s;
          }
          .loading-spinner div:nth-child(3) {
            animation-delay: -1s;
          }
          @keyframes loading-spinner {
            0% {
              top: 36px;
              left: 36px;
              width: 0;
              height: 0;
              opacity: 1;
            }
            100% {
              top: 0px;
              left: 0px;
              width: 72px;
              height: 72px;
              opacity: 0;
            }
          }
        `}</style>
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
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)",
          borderRadius: "12px",
        }}
      >
        <span
          className="material-icons-round"
          style={{ fontSize: "48px", color: "var(--color-error)" }}
        >
          error_outline
        </span>
        <Text
          variant="heading-strong-m"
          color="error"
          style={{ marginTop: "16px" }}
        >
          Quiz Not Found
        </Text>
        <Text
          variant="body-default-m"
          style={{
            marginTop: "16px",
            textAlign: "center",
            maxWidth: "500px",
          }}
        >
          This course may not have any quizzes associated with it yet, or the
          quiz data may have failed to load.
        </Text>
        <Button
          variant="secondary"
          onClick={() => router.push(`/courses/${courseSlug}/${lessonSlug}`)}
          style={{ marginTop: "24px" }}
        >
          Back to Course
        </Button>
      </Flex>
    );
  }

  // 渲染问题导航
  const renderQuestionNav = () => {
    if (!quizData?.questions) return null;

    return (
      <Flex
        gap="s"
        wrap="wrap"
        style={{
          marginBottom: "20px",
        }}
      >
        {quizData.questions.map((_, index) => {
          const isAnswered =
            userAnswers[quizData.questions[index].id] !== undefined;
          const isCurrent = index === currentQuestionIndex;

          return (
            <Button
              key={index}
              variant={
                isCurrent ? "primary" : isAnswered ? "secondary" : "tertiary"
              }
              size="s"
              onClick={() => setCurrentQuestionIndex(index)}
              style={{
                width: "36px",
                height: "36px",
                padding: 0,
                borderRadius: "50%",
                transition: "all 0.2s ease",
                transform: isCurrent ? "scale(1.1)" : "scale(1)",
              }}
            >
              {index + 1}
            </Button>
          );
        })}
      </Flex>
    );
  };

  // 渲染当前问题
  const renderCurrentQuestion = () => {
    if (!quizData?.questions || quizData.questions.length === 0) {
      return (
        <Card padding="xl">
          <Text variant="body-default-m">No available questions</Text>
        </Card>
      );
    }

    const question = quizData.questions[currentQuestionIndex];
    const questionProgress = Math.round(
      ((currentQuestionIndex + 1) / quizData.questions.length) * 100
    );

    return (
      <Card
        padding="xl"
        style={{
          marginBottom: "20px",
          border: "1px solid rgba(51, 102, 255, 0.2)",
          background:
            "linear-gradient(135deg, rgba(51, 102, 255, 0.05) 0%, rgba(0,0,0,0.1) 100%)",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
        }}
      >
        <Flex direction="column" gap="l">
          <Flex
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Flex gap="s" vertical="center">
              <div
                style={{
                  background: "rgba(51, 102, 255, 0.1)",
                  color: "var(--color-primary)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {question.type === QuestionType.SINGLE_CHOICE
                  ? "Single Choice"
                  : question.type === QuestionType.MULTIPLE_CHOICE
                  ? "Multiple Choice"
                  : question.type === QuestionType.TRUE_FALSE
                  ? "True/False"
                  : "Short Answer"}
              </div>
              <Text variant="heading-strong-s">
                Question {currentQuestionIndex + 1} /{" "}
                {quizData.questions.length}
              </Text>
            </Flex>
            <div
              style={{
                background: "rgba(76, 175, 80, 0.1)",
                color: "var(--color-success)",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {question.points} points
            </div>
          </Flex>

          <Progress
            value={questionProgress}
            max={100}
            size="s"
            status="success"
          />

          <Text
            variant="body-strong-l"
            style={{
              marginBottom: "16px",
              padding: "12px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "8px",
              borderLeft: "4px solid rgba(51, 102, 255, 0.7)",
            }}
          >
            {question.question}
          </Text>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              margin: "8px 0",
            }}
          />

          {/* 根据问题类型渲染不同的答题控件 */}
          <div style={{ padding: "8px 0" }}>
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
                label="Your Answer"
                value={userAnswers[question.id] || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleAnswerChange(question.id, e.target.value)
                }
                placeholder="Please enter your answer"
              />
            )}
          </div>
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
      <Card
        padding="xl"
        style={{
          background: passed
            ? "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(0,0,0,0.1) 100%)"
            : "linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(0,0,0,0.1) 100%)",
          border: `1px solid ${
            passed ? "rgba(76, 175, 80, 0.3)" : "rgba(244, 67, 54, 0.3)"
          }`,
          borderRadius: "12px",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Flex direction="column" gap="l" style={{ alignItems: "center" }}>
          <Flex gap="s" vertical="center">
            <span
              className="material-icons-round"
              style={{
                fontSize: "28px",
                color: passed ? "var(--color-success)" : "var(--color-error)",
              }}
            >
              {passed ? "check_circle" : "cancel"}
            </span>
            <Text variant="heading-strong-l">Quiz Results</Text>
          </Flex>

          <div style={{ width: "100%", maxWidth: "300px", padding: "20px 0" }}>
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
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            {score}%
          </Text>

          <div
            style={{
              padding: "8px 16px",
              marginBottom: "16px",
              background: passed
                ? "rgba(76, 175, 80, 0.1)"
                : "rgba(244, 67, 54, 0.1)",
              color: passed ? "var(--color-success)" : "var(--color-error)",
              borderRadius: "20px",
              fontWeight: "bold",
            }}
          >
            {passed ? "PASSED" : "FAILED"}
          </div>

          <Text
            variant="body-strong-l"
            style={{
              textAlign: "center",
              maxWidth: "500px",
            }}
          >
            {passed
              ? "Congratulations, you have passed the quiz! Your knowledge has been verified."
              : "Unfortunately, you did not pass the quiz. Keep learning and try again."}
          </Text>

          <Flex
            style={{
              justifyContent: "space-between",
              width: "100%",
              marginTop: "8px",
            }}
          >
            <Text variant="body-default-m">
              Passing Score: {quizData.passingScore}%
            </Text>
            <Text variant="body-default-m">Your Score: {score}%</Text>
          </Flex>

          <hr
            style={{
              width: "100%",
              border: "none",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              margin: "16px 0",
            }}
          />

          <Flex gap="m">
            <Button
              variant="secondary"
              onClick={() =>
                router.push(`/courses/${courseSlug}/${lessonSlug}`)
              }
            >
              <span
                className="material-icons-round"
                style={{ marginRight: "8px", fontSize: "18px" }}
              >
                arrow_back
              </span>
              Back to Lesson
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
                <span
                  className="material-icons-round"
                  style={{ marginRight: "8px", fontSize: "18px" }}
                >
                  refresh
                </span>
                Retake Quiz
              </Button>
            )}
          </Flex>
        </Flex>
      </Card>
    );
  };

  return (
    <div
      className="quiz-container"
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
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

        <Flex gap="s" wrap="wrap">
          <div
            style={{
              background: "rgba(51, 102, 255, 0.1)",
              color: "var(--color-primary)",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            ID: {quizData.id}
          </div>
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

      {validationErrors.length > 0 && (
        <Card
          padding="m"
          style={{
            marginBottom: "20px",
            backgroundColor: "rgba(244, 67, 54, 0.1)",
            border: "1px solid rgba(244, 67, 54, 0.3)",
            borderRadius: "8px",
          }}
        >
          <Flex gap="s" style={{ marginBottom: "8px", alignItems: "center" }}>
            <span
              className="material-icons-round"
              style={{ color: "var(--color-error)", fontSize: "18px" }}
            >
              error_outline
            </span>
            <Text variant="body-strong-m" color="error">
              Please fix the following issues:
            </Text>
          </Flex>
          <Flex direction="column" gap="s">
            {validationErrors.map((error, index) => (
              <Text key={index} variant="body-default-m" color="error">
                • {error}
              </Text>
            ))}
          </Flex>
        </Card>
      )}

      {!quizSubmitted && renderQuestionNav()}

      {quizSubmitted ? renderQuizResults() : renderCurrentQuestion()}

      {!quizSubmitted && (
        <Flex style={{ justifyContent: "space-between", marginTop: "24px" }}>
          <Button
            variant="tertiary"
            onClick={goToPrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <span
              className="material-icons-round"
              style={{ marginRight: "8px", fontSize: "18px" }}
            >
              arrow_back
            </span>
            Previous
          </Button>

          <Button
            variant="primary"
            onClick={
              currentQuestionIndex < (quizData?.questions?.length || 0) - 1
                ? goToNextQuestion
                : handleSubmitQuiz
            }
            disabled={Boolean(isLoading)}
            style={{
              background:
                currentQuestionIndex < (quizData?.questions?.length || 0) - 1
                  ? undefined
                  : "linear-gradient(90deg, #3366FF, #00CCFF)",
              transition: "all 0.3s ease",
            }}
          >
            {isLoading ? (
              "Processing..."
            ) : (
              <>
                {currentQuestionIndex <
                (quizData?.questions?.length || 0) - 1 ? (
                  <>
                    Next Question
                    <span
                      className="material-icons-round"
                      style={{ marginLeft: "8px", fontSize: "18px" }}
                    >
                      arrow_forward
                    </span>
                  </>
                ) : (
                  <>
                    Submit Quiz
                    <span
                      className="material-icons-round"
                      style={{ marginLeft: "8px", fontSize: "18px" }}
                    >
                      check
                    </span>
                  </>
                )}
              </>
            )}
          </Button>
        </Flex>
      )}
    </div>
  );
}

// 主组件
export default function QuizPage({ params }: PageProps) {
  // Next.js 15+ 中参数可能是 Promise
  try {
    const resolvedParams = useRouteParams(params);

    return (
      <QuizContent
        courseSlug={resolvedParams.coursename}
        lessonSlug={resolvedParams.lessonname}
      />
    );
  } catch (error) {
    // 发生错误由error.tsx处理，这里不需要处理
    throw error;
  }
}
