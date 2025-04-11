import React from "react";
import { Flex, Text, Card } from "@/once-ui/components";
import { QuestionType } from "@/features/types/api/quiz-question";
import Progress from "../../ui/progress";
import Markdown from "@/features/mdx/components/code/markdown";
import SingleChoiceQuestion from "../single-choice-question";
import MultipleChoiceQuestion from "../mutiple-choice-question";
import TrueFalseQuestion from "../true-false-question";
import ShortAnswerQuestion from "../short-answer-question";
import ProgrammingQuestion from "../programming-question";

interface QuestionRendererProps {
  question: any;
  questionIndex: number;
  totalQuestions: number;
  userAnswer: string | string[];
  onChange: (questionId: number, answer: string | string[]) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  questionIndex,
  totalQuestions,
  userAnswer,
  onChange,
}) => {
  if (!question) {
    return (
      <Card padding="xl">
        <Text variant="body-default-m">No available questions</Text>
      </Card>
    );
  }

  const questionProgress = Math.round(
    ((questionIndex + 1) / totalQuestions) * 100
  );

  const renderQuestionType = () => {
    switch (question.type) {
      case QuestionType.SINGLE_CHOICE:
        return (
          <SingleChoiceQuestion
            questionId={question.id}
            options={question.options}
            value={
              Array.isArray(userAnswer) ? "" : userAnswer?.toString() || ""
            }
            onChange={onChange}
          />
        );
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <MultipleChoiceQuestion
            questionId={question.id}
            options={question.options}
            value={Array.isArray(userAnswer) ? userAnswer : []}
            onChange={onChange}
          />
        );
      case QuestionType.TRUE_FALSE:
        return (
          <TrueFalseQuestion
            questionId={question.id}
            options={question.options}
            value={
              Array.isArray(userAnswer) ? "" : userAnswer?.toString() || ""
            }
            onChange={onChange}
          />
        );
      case QuestionType.SHORT_ANSWER:
        return (
          <ShortAnswerQuestion
            questionId={question.id}
            value={
              Array.isArray(userAnswer) ? "" : userAnswer?.toString() || ""
            }
            onChange={onChange}
          />
        );
      case QuestionType.PROGRAMMING:
        return (
          <ProgrammingQuestion
            questionId={question.id}
            codeTemplate={question.codeTemplate}
            value={
              Array.isArray(userAnswer) ? "" : userAnswer?.toString() || ""
            }
            onChange={onChange}
          />
        );
      default:
        return <Text>Question type not supported</Text>;
    }
  };

  return (
    <Flex direction="column" gap="l">
      <Flex style={{ justifyContent: "space-between", alignItems: "center" }}>
        <Flex gap="s" style={{ alignItems: "center" }}>
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
              : question.type === QuestionType.SHORT_ANSWER
              ? "Short Answer"
              : "Programming"}
          </div>
          <Text variant="heading-strong-s">
            Question {questionIndex + 1} / {totalQuestions}
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

      <Progress value={questionProgress} max={100} size="s" status="success" />

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
        <Markdown>{question.question}</Markdown>
      </Text>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          margin: "8px 0",
        }}
      />

      <div style={{ padding: "8px 0" }}>{renderQuestionType()}</div>
    </Flex>
  );
};

export default QuestionRenderer;
