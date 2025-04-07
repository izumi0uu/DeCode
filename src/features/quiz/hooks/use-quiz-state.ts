import { useState } from "react";

export interface QuizState {
  currentQuestionIndex: number;
  userAnswers: Record<number, string | string[]>;
  quizSubmitted: boolean;
  validationErrors: string[];
}

const useQuizState = () => {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    userAnswers: {},
    quizSubmitted: false,
    validationErrors: [],
  });

  const setCurrentQuestionIndex = (index: number) => {
    setState((prev) => ({
      ...prev,
      currentQuestionIndex: index,
    }));
  };

  const handleAnswerChange = (
    questionId: number,
    answer: string | string[]
  ) => {
    setState((prev) => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [questionId]: answer,
      },
      validationErrors: [],
    }));
  };

  const setQuizSubmitted = (submitted: boolean) => {
    setState((prev) => ({
      ...prev,
      quizSubmitted: submitted,
    }));
  };

  const setValidationErrors = (errors: string[]) => {
    setState((prev) => ({
      ...prev,
      validationErrors: errors,
    }));
  };

  const resetQuiz = () => {
    setState({
      currentQuestionIndex: 0,
      userAnswers: {},
      quizSubmitted: false,
      validationErrors: [],
    });
  };

  return {
    state,
    setCurrentQuestionIndex,
    handleAnswerChange,
    setQuizSubmitted,
    setValidationErrors,
    resetQuiz,
  };
};

export default useQuizState;
