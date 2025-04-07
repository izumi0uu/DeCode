import React from "react";
import { Flex, RadioButton } from "@/once-ui/components";
import RadioGroup from "../../ui/radio-group";

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface SingleChoiceQuestionProps {
  questionId: number;
  options: Option[];
  value: string;
  onChange: (questionId: number, value: string) => void;
}

const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({
  questionId,
  options,
  value,
  onChange,
}) => {
  return (
    <RadioGroup
      name={`question-${questionId}`}
      selectedValue={value || ""}
      onChange={(value: string) => onChange(questionId, value)}
    >
      <Flex direction="column" gap="m">
        {options.map((option) => (
          <RadioButton
            key={option.id}
            value={option.id.toString()}
            label={option.text}
          />
        ))}
      </Flex>
    </RadioGroup>
  );
};

export default SingleChoiceQuestion;
