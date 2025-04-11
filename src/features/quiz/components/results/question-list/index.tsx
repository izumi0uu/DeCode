"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { QuestionType } from "@/features/types/api/quiz-question";
import { useQuizResultContext } from "@/features/quiz/contexts/quiz-result-context";
import { RegularQuestionResult } from "@/features/quiz/components/results/regular-question-result";
import { CodeQuestionResult } from "@/features/quiz/components/results/code-question-result";
import { ResultSkeleton } from "@/features/quiz/components/skeletons";
import { containerVariants } from "@/features/quiz/constants/animation";

export const QuestionList = () => {
  const { quizData, userAnswers } = useQuizResultContext();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        width: "100%",
        marginTop: "32px",
        gap: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {quizData?.questions.map((question: any, index: number) => {
        const userAnswer = userAnswers[question.id];

        if (question.type === QuestionType.PROGRAMMING) {
          return (
            <Suspense key={question.id} fallback={<ResultSkeleton />}>
              <CodeQuestionResult
                question={question}
                userAnswer={userAnswer}
                quizId={quizData.id}
                index={index}
              />
            </Suspense>
          );
        }

        const correctAnswer = question.options
          .filter((opt: any) => opt.isCorrect)
          .map((opt: any) => opt.id.toString());

        return (
          <Suspense key={question.id} fallback={<ResultSkeleton />}>
            <RegularQuestionResult
              question={question}
              userAnswer={userAnswer}
              correctAnswer={
                correctAnswer.length === 1 ? correctAnswer[0] : correctAnswer
              }
              index={index}
            />
          </Suspense>
        );
      })}
    </motion.div>
  );
};
