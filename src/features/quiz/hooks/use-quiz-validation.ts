import { useState } from "react";
import { QuestionType, QuizQuestion } from "@/features/types/api/quiz-question";

const useQuizValidation = (
  quizData: any,
  userAnswers: Record<number, string | string[]>
) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateAnswers = () => {
    const errors: string[] = [];
    if (!quizData?.questions) return errors;

    quizData.questions.forEach((question: QuizQuestion) => {
      const answer = userAnswers[question.id];
      if (!answer) {
        errors.push(`Please answer question ${question.id}`);
      } else if (question.type === QuestionType.MULTIPLE_CHOICE) {
        if (!Array.isArray(answer) || answer.length === 0) {
          errors.push(
            `Please select at least one option for question ${question.id}`
          );
        }
      } else if (typeof answer !== "string" || answer.trim() === "") {
        errors.push(`Please provide an answer for question ${question.id}`);
      }
    });

    setValidationErrors(errors);
    return errors;
  };

  return {
    validationErrors,
    validateAnswers,
    setValidationErrors,
  };
};

export default useQuizValidation;
