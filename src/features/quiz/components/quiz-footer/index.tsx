import React from "react";
import { Flex, Button } from "@/once-ui/components";

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
      <Button
        variant="tertiary"
        onClick={onPrevious}
        disabled={currentIndex === 0}
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
  );
};

export default QuizFooter;
