// features/quiz/contexts/quiz-result-context.tsx
"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useGetQuizAnswers } from "@/features/quiz/api/use-get-quiz-option-answer";
import { QuestionType, QuizQuestion } from "@/features/types/api/quiz-question";
import { QuizOption } from "@/features/types/api/quiz-option";
import { Quiz } from "@/features/types/api/quiz";

// 定义类型
export type UserAnswers = Record<string, string | string[]>;

interface QuizResultContextType {
  quizData: Quiz | null;
  userAnswers: UserAnswers;
  score: { correct: number; total: number };
  isLoading: boolean;
}

const QuizResultContext = createContext<QuizResultContextType | null>(null);

export const useQuizResultContext = () => {
  const context = useContext(QuizResultContext);
  if (!context) {
    throw new Error(
      "useQuizResultContext must be used within a QuizResultProvider"
    );
  }
  return context;
};

export const QuizResultProvider = ({
  children,
  lessonname,
}: {
  children: ReactNode;
  lessonname: string;
}) => {
  const { data: quizData, isLoading } = useGetQuizAnswers(lessonname);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    // 从本地存储获取用户提交的答案
    const savedAnswers = localStorage.getItem(`quiz_answers_${lessonname}`);
    if (savedAnswers) {
      try {
        setUserAnswers(JSON.parse(savedAnswers));
      } catch (e) {
        console.error("Failed to parse local storage answers:", e);
      }
    }
  }, [lessonname]);

  // 计算得分
  useEffect(() => {
    if (quizData?.questions && Object.keys(userAnswers).length > 0) {
      let earnedPoints = 0;
      let totalPoints = 0;

      quizData.questions.forEach((question: QuizQuestion) => {
        // 累加总分
        totalPoints += question.points || 0;

        if (question.type !== QuestionType.PROGRAMMING) {
          const userAnswer = userAnswers[question.id];
          const correctAnswer = question.options
            .filter((opt: QuizOption) => opt.isCorrect)
            .map((opt: QuizOption) => opt.id.toString());

          const isMultipleChoice = correctAnswer.length > 1;
          const isCorrect = isMultipleChoice
            ? Array.isArray(userAnswer) &&
              userAnswer.length === correctAnswer.length &&
              userAnswer.every((a) => correctAnswer.includes(a))
            : userAnswer === correctAnswer[0];

          if (isCorrect) earnedPoints += question.points || 0;
        }
      });

      setScore({
        correct: earnedPoints,
        total: totalPoints,
      });
    }
  }, [quizData, userAnswers]);

  return (
    <QuizResultContext.Provider
      value={{
        quizData,
        userAnswers,
        score,
        isLoading,
      }}
    >
      {children}
    </QuizResultContext.Provider>
  );
};
