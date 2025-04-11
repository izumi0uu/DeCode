// components/QuizContent.tsx
"use client";

import React, { RefObject, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { Flex } from "@/once-ui/components";

import ScrollToBottomButton from "@/components/ui/scroll-to-bottom-button";
import ValidationErrors from "../validation-errors";
import { useGetLessonQuizDetailed } from "@/features/quiz/api/use-get-lesson-quiz";
import { useToast } from "@/once-ui/components/ToastProvider";
import QuizHeader from "../quiz-header";
import QuestionNav from "../question-nav";
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

const QuizContent: React.FC<QuizContentProps> = ({
  courseSlug,
  lessonSlug,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();
  const router = useRouter();

  const {
    state,
    setCurrentQuestionIndex,
    handleAnswerChange,
    setValidationErrors,
    setQuizSubmitted,
  } = useQuizState();

  const { data: quizData, isLoading: quizLoading } =
    useGetLessonQuizDetailed(lessonSlug);

  const { timeLeft } = useQuizTimer(quizData, false);

  const validation = useQuizValidation(quizData, state.userAnswers);

  const { isLoading, handleSubmit: submitQuiz } = useQuizSubmission(
    quizData,
    state.userAnswers,
    validation.validateAnswers,
    lessonSlug
  );

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

  // 提交处理
  const handleSubmit = () => {
    // 防止重复提交
    if (state.quizSubmitted) {
      console.log("Quiz already submitted, preventing duplicate submission");
      return;
    }

    const errors = validation.validateAnswers();
    if (errors.length > 0) {
      setValidationErrors(errors);
      addToast({
        variant: "danger",
        message: "please answer all required questions",
      });
      return;
    }

    // 保存答案到本地存储，供结果页面使用
    localStorage.setItem(
      `quiz_answers_${lessonSlug}`,
      JSON.stringify(state.userAnswers)
    );

    // 保存题目到本地存储，供AI反馈使用
    if (quizData?.questions) {
      localStorage.setItem(
        `quiz_questions_${quizData.slug}`,
        JSON.stringify(quizData.questions)
      );
    }

    // 设置提交状态为true，防止重复提交
    setQuizSubmitted(true);

    // 显示提交中提示
    addToast({
      variant: "success",
      message: "submitting quiz...",
    });

    // 提交答案
    submitQuiz();

    // 直接跳转到结果页面，不依赖useEffect监听isSubmitted
    router.push(`/courses/${courseSlug}/${lessonSlug}/quiz/result`);
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

        <QuestionNav
          questions={quizData.questions}
          currentIndex={state.currentQuestionIndex}
          userAnswers={state.userAnswers}
          onNavigation={setCurrentQuestionIndex}
        />

        <QuestionRenderer
          question={quizData.questions[state.currentQuestionIndex]}
          questionIndex={state.currentQuestionIndex}
          totalQuestions={quizData.questions.length}
          userAnswer={
            state.userAnswers[quizData.questions[state.currentQuestionIndex].id]
          }
          onChange={handleAnswerChange}
        />

        <QuizFooter
          currentIndex={state.currentQuestionIndex}
          totalQuestions={quizData.questions.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Flex>

      <ScrollToBottomButton
        containerRef={containerRef as RefObject<HTMLElement>}
      />
    </>
  );
};

export default QuizContent;
