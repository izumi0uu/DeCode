import React from "react";
import { Flex, Button, IconButton, Text, Icon } from "@/once-ui/components";

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

      {isLoading ? (
        <Button variant="primary" disabled>
          Processing...
        </Button>
      ) : !isLastQuestion ? (
        <IconButton
          onClick={onNext}
          icon="chevronRight"
          size="m"
          tooltip="Next Question"
          tooltipPosition="top"
          variant="primary"
        />
      ) : (
        <Button
          variant="primary"
          onClick={onSubmit}
          style={{
            background: "linear-gradient(90deg, #3366FF, #00CCFF)",
            transition: "all 0.3s ease",
          }}
        >
          <Text>SUBMIT</Text>
        </Button>
      )}
    </Flex>
  );
};

export default QuizFooter;
