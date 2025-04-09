// components/QuizContent.tsx
"use client";

import React, { RefObject, useEffect, useRef } from "react";
import { useOptimistic } from "react";

import { Flex } from "@/once-ui/components";

import ScrollToBottomButton from "@/components/ui/scroll-to-bottom-button";
import ValidationErrors from "../validation-errors";
import { useGetLessonQuizDetailed } from "@/features/quiz/api/use-get-lesson-quiz";
import { useToast } from "@/once-ui/components/ToastProvider";
import QuizHeader from "../quiz-header";
import QuestionNav from "../question-nav";
import QuizResults from "../quiz-results";
import QuestionRenderer from "../questions/question-renderer";
import QuizFooter from "../quiz-footer";
import QuizNotFound from "../quiz-not-found";

import useQuizState from "../../hooks/use-quiz-state";
import useQuizTimer from "../../hooks/use-quiz-timer";
import useQuizValidation from "../../hooks/use-quiz-validation";
import useQuizSubmission from "../../hooks/use-quiz-submisson";
import styles from "./index.module.scss";

interface QuizContentProps {
  courseSlug: string;
  lessonSlug: string;
}

interface OptimisticState {
  submitted: boolean;
  score: number;
}

const QuizContent: React.FC<QuizContentProps> = ({
  courseSlug,
  lessonSlug,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

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

  // 添加乐观UI状态
  const [optimisticState, addOptimistic] = useOptimistic<
    OptimisticState,
    Partial<OptimisticState>
  >({ submitted: false, score: 0 }, (state, newState) => ({
    ...state,
    ...newState,
  }));

  const {
    isLoading,
    isSubmitted,
    setIsSubmitted,
    calculateScore,
    score,
    handleSubmit: submitQuiz,
  } = useQuizSubmission(
    quizData,
    state.userAnswers,
    validation.validateAnswers,
    lessonSlug
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
      addToast({
        variant: "danger",
        message: "time's up! quiz will be submitted automatically",
      });
      handleSubmit();
    }
  }, [timeLeft, state.quizSubmitted]);

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

  // 带有乐观UI的提交处理
  const handleSubmit = () => {
    const errors = validation.validateAnswers();
    if (errors.length > 0) {
      setValidationErrors(errors);
      addToast({
        variant: "danger",
        message: "please answer all required questions",
      });
      return;
    }

    // 立即更新乐观UI状态
    const optimisticScore = calculateScore();
    addOptimistic({
      submitted: true,
      score: optimisticScore,
    });

    // 实际提交
    submitQuiz();
  };

  // 处理重新测验
  const handleRetake = () => {
    resetQuiz();
    resetTimer();
    setIsSubmitted(false);
    addOptimistic({ submitted: false, score: 0 });

    addToast({
      variant: "success",
      message: "quiz reset",
    });
  };

  // 数据不存在
  if (!quizData) {
    return <QuizNotFound courseSlug={courseSlug} lessonSlug={lessonSlug} />;
  }

  const isOptimisticallySubmitted =
    optimisticState.submitted && !state.quizSubmitted;

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

        {!state.quizSubmitted && !isOptimisticallySubmitted && (
          <QuestionNav
            questions={quizData.questions}
            currentIndex={state.currentQuestionIndex}
            userAnswers={state.userAnswers}
            onNavigation={setCurrentQuestionIndex}
          />
        )}

        {state.quizSubmitted || isOptimisticallySubmitted ? (
          <QuizResults
            quizData={quizData}
            score={isSubmitted ? score : optimisticState.score}
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

        {!state.quizSubmitted && !isOptimisticallySubmitted && (
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
