// components/QuizContent.tsx
"use client";

import React, { RefObject, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Flex } from "@/once-ui/components";
import { useGetLessonQuizDetailed } from "@/features/quiz/api/use-get-lesson-quiz";
import QuizHeader from "../quiz-header";
import ValidationErrors from "../validation-errors";
import QuestionNav from "../question-nav";
import QuizResults from "../quiz-results";
import QuestionRenderer from "../questions/question-renderer";
import QuizFooter from "../quiz-footer";
import QuizNotFound from "../quiz-not-found";
import ScrollToBottomButton from "@/components/ui/scroll-to-bottom-button";
import useQuizState from "../../hooks/use-quiz-state";
import useQuizTimer from "../../hooks/use-quiz-timer";
import useQuizValidation from "../../hooks/use-quiz-validation";
import useQuizSubmission from "../../hooks/use-quiz-submisson";
import styles from "./index.module.scss";

interface QuizContentProps {
  courseSlug: string;
  lessonSlug: string;
}

const QuizContent: React.FC<QuizContentProps> = ({
  courseSlug,
  lessonSlug,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    state,
    setCurrentQuestionIndex,
    handleAnswerChange,
    setQuizSubmitted,
    setValidationErrors,
    resetQuiz,
  } = useQuizState();

  const { data: quizData, isLoading: quizLoading } =
    useGetLessonQuizDetailed(lessonSlug);

  const { timeLeft, resetTimer } = useQuizTimer(quizData, state.quizSubmitted);

  const validation = useQuizValidation(quizData, state.userAnswers);

  const {
    isLoading,
    isSubmitted,
    setIsSubmitted,
    calculateScore,
    handleSubmit,
  } = useQuizSubmission(
    quizData,
    state.userAnswers,
    validation.validateAnswers
  );

  // 监听提交状态变化
  useEffect(() => {
    if (isSubmitted) {
      setQuizSubmitted(true);
    }
  }, [isSubmitted, setQuizSubmitted]);

  // 处理自动提交（时间到）
  useEffect(() => {
    if (timeLeft === 0 && !state.quizSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, state.quizSubmitted, handleSubmit]);

  // 处理下一题
  const handleNext = () => {
    if (
      quizData?.questions &&
      state.currentQuestionIndex < quizData.questions.length - 1
    ) {
      setCurrentQuestionIndex(state.currentQuestionIndex + 1);
    }
  };

  // 处理上一题
  const handlePrevious = () => {
    if (state.currentQuestionIndex > 0) {
      setCurrentQuestionIndex(state.currentQuestionIndex - 1);
    }
  };

  // 处理重新测验
  const handleRetake = () => {
    resetQuiz();
    resetTimer();
    setIsSubmitted(false);
  };

  // 数据不存在
  if (!quizData) {
    return <QuizNotFound courseSlug={courseSlug} lessonSlug={lessonSlug} />;
  }

  return (
    <>
      <Flex
        ref={containerRef}
        direction="column"
        className={styles.quizContainer}
      >
        <QuizHeader quizData={quizData} timeLeft={timeLeft} />

        {validation.validationErrors.length > 0 && (
          <ValidationErrors errors={validation.validationErrors} />
        )}

        {!state.quizSubmitted && (
          <QuestionNav
            questions={quizData.questions}
            currentIndex={state.currentQuestionIndex}
            userAnswers={state.userAnswers}
            onNavigation={setCurrentQuestionIndex}
          />
        )}

        {state.quizSubmitted ? (
          <QuizResults
            quizData={quizData}
            score={calculateScore()}
            onRetake={handleRetake}
            courseSlug={courseSlug}
            lessonSlug={lessonSlug}
          />
        ) : (
          <QuestionRenderer
            question={quizData.questions[state.currentQuestionIndex]}
            questionIndex={state.currentQuestionIndex}
            totalQuestions={quizData.questions.length}
            userAnswer={
              state.userAnswers[
                quizData.questions[state.currentQuestionIndex].id
              ]
            }
            onChange={handleAnswerChange}
          />
        )}

        {!state.quizSubmitted && (
          <QuizFooter
            currentIndex={state.currentQuestionIndex}
            totalQuestions={quizData.questions.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </Flex>

      <ScrollToBottomButton
        containerRef={containerRef as RefObject<HTMLElement>}
      />
    </>
  );
};

export default QuizContent;
