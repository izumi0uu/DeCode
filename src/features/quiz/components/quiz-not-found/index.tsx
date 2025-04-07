import React from "react";
import { Flex, Text, Button } from "@/once-ui/components";
import { useRouter } from "next/navigation";

interface QuizNotFoundProps {
  courseSlug: string;
  lessonSlug: string;
}

const QuizNotFound: React.FC<QuizNotFoundProps> = ({
  courseSlug,
  lessonSlug,
}) => {
  const router = useRouter();

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
        This course may not have any quizzes associated with it yet, or the quiz
        data may have failed to load.
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
};

export default QuizNotFound;
