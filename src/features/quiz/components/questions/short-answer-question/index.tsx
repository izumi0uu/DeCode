import React, { ChangeEvent } from "react";
import { Input } from "@/once-ui/components";

interface ShortAnswerQuestionProps {
  questionId: number;
  value: string;
  onChange: (questionId: number, value: string) => void;
}

const ShortAnswerQuestion: React.FC<ShortAnswerQuestionProps> = ({
  questionId,
  value,
  onChange,
}) => {
  return (
    <Input
      id={`question-${questionId}`}
      label="Your Answer"
      value={value || ""}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        onChange(questionId, e.target.value)
      }
      placeholder="Please enter your answer"
    />
  );
};

export default ShortAnswerQuestion;
