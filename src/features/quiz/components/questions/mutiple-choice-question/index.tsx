import React from "react";
import { Flex, Checkbox } from "@/once-ui/components";
import CheckboxGroup from "../../ui/checkoutbox-gruop";

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface MultipleChoiceQuestionProps {
  questionId: number;
  options: Option[];
  value: string[];
  onChange: (questionId: number, value: string[]) => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  questionId,
  options,
  value,
  onChange,
}) => {
  return (
    <CheckboxGroup
      value={value || []}
      onChange={(newAnswers: string[]) => onChange(questionId, newAnswers)}
    >
      <Flex direction="column" gap="m">
        {options.map((option) => (
          <Checkbox
            key={option.id}
            value={option.id.toString()}
            label={option.text}
          />
        ))}
      </Flex>
    </CheckboxGroup>
  );
};

export default MultipleChoiceQuestion;
