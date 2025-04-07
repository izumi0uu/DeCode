import React from "react";
import { Flex, Button } from "@/once-ui/components";

interface QuestionNavProps {
  questions: any[];
  currentIndex: number;
  userAnswers: Record<number, string | string[]>;
  onNavigation: (index: number) => void;
}

const QuestionNav: React.FC<QuestionNavProps> = ({
  questions,
  currentIndex,
  userAnswers,
  onNavigation,
}) => {
  if (!questions || questions.length === 0) return null;

  return (
    <Flex
      gap="s"
      style={{
        marginBottom: "20px",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {questions.map((_, index) => {
        const isAnswered = userAnswers[questions[index].id] !== undefined;
        const isCurrent = index === currentIndex;

        return (
          <Button
            key={index}
            variant={
              isCurrent ? "primary" : isAnswered ? "secondary" : "tertiary"
            }
            size="s"
            onClick={() => onNavigation(index)}
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

export default QuestionNav;
