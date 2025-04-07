import React from "react";
import { Flex, Button, IconButton, Text } from "@/once-ui/components";

interface QuizFooterProps {
  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const QuizFooter: React.FC<QuizFooterProps> = ({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  isLoading,
}) => {
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <Flex style={{ justifyContent: "space-between", marginTop: "24px" }}>
      <IconButton
        onClick={onPrevious}
        icon="chevronLeft"
        size="m"
        tooltip="Previous Question"
        tooltipPosition="top"
        variant="primary"
        disabled={currentIndex === 0}
      />

      <Button
        variant="primary"
        onClick={isLastQuestion ? onSubmit : onNext}
        disabled={Boolean(isLoading)}
        style={{
          background: isLastQuestion
            ? "linear-gradient(90deg, #3366FF, #00CCFF)"
            : undefined,
          transition: "all 0.3s ease",
        }}
      >
        {isLoading ? (
          "Processing..."
        ) : (
          <>
            {!isLastQuestion ? (
              <IconButton
                onClick={onNext}
                icon="chevronRight"
                size="m"
                tooltip="Next Question"
                tooltipPosition="top"
                variant="primary"
              />
            ) : (
              <Flex align="center" center>
                <IconButton
                  onClick={onSubmit}
                  icon="check"
                  size="m"
                  tooltip="Submit Quiz"
                  tooltipPosition="top"
                  variant="primary"
                />
                <Text>Submit Quiz</Text>
              </Flex>
            )}
          </>
        )}
      </Button>
    </Flex>
  );
};

export default QuizFooter;
