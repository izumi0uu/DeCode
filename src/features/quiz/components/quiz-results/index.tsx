// components/QuizResults.tsx
import React from "react";
import { Flex, Text, Card, Button } from "@/once-ui/components";
import { useRouter } from "next/navigation";
import Progress from "../ui/progress";

interface QuizResultsProps {
  quizData: any;
  score: number;
  onRetake: () => void;
  courseSlug: string;
  lessonSlug: string;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  quizData,
  score,
  onRetake,
  courseSlug,
  lessonSlug,
}) => {
  const router = useRouter();
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
        <Flex gap="s" style={{ alignItems: "center" }}>
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
            onClick={() => router.push(`/courses/${courseSlug}/${lessonSlug}`)}
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
            <Button variant="primary" onClick={onRetake}>
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

export default QuizResults;
