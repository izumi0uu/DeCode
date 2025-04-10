// hooks/useQuizSubmission.ts
import { useState } from "react";
import { useTransition } from "react";
import { QuestionType, QuizQuestion } from "@/features/types/api/quiz-question";
import { submitQuizAnswer } from "@/app/actions/quiz-actions";
import { useToast } from "@/once-ui/components/ToastProvider";

const useQuizSubmission = (
  quizData: any,
  userAnswers: Record<number, string | string[]>,
  validateAnswers: () => string[],
  lessonSlug: string
) => {
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const { addToast } = useToast();

  const calculateScore = () => {
    if (!quizData?.questions) return 0;

    let totalScore = 0;
    let totalPoints = 0;

    quizData.questions.forEach((question: QuizQuestion) => {
      totalPoints += question.points || 1;

      const userAnswer = userAnswers[question.id];
      if (!userAnswer) return;

      if (question.type === QuestionType.MULTIPLE_CHOICE) {
        if (Array.isArray(userAnswer)) {
          const correctAnswers = question.options
            .filter((option: any) => option.isCorrect)
            .map((option: any) => option.id.toString());

          if (
            correctAnswers.length === 1 &&
            userAnswer.includes(correctAnswers[0]) &&
            userAnswer.length === 1
          ) {
            totalScore += question.points || 1;
          } else if (
            correctAnswers.length > 1 &&
            userAnswer.length === correctAnswers.length &&
            userAnswer.every((answer) => correctAnswers.includes(answer))
          ) {
            totalScore += question.points || 1;
          }
        }
      } else if (question.type !== QuestionType.PROGRAMMING) {
        // 跳过编程题的评分，因为编程题需要AI评分
        const correctAnswer = question.options
          .find((option: any) => option.isCorrect)
          ?.id.toString();

        if (userAnswer === correctAnswer) {
          totalScore += question.points || 1;
        }
      }
    });

    return Math.round((totalScore / totalPoints) * 100);
  };

  const handleSubmit = async () => {
    const errors = validateAnswers();
    if (errors.length > 0) {
      addToast({
        variant: "danger",
        message: "Please answer all required questions",
      });
      return;
    }

    // 防止重复提交
    if (isSubmitted || isPending) {
      return;
    }

    // 显示提交中的Toast
    addToast({
      variant: "success",
      message: "提交测验中...",
    });

    startTransition(async () => {
      try {
        // 提交答案到服务器
        const result = await submitQuizAnswer(
          lessonSlug,
          userAnswers,
          quizData.questions
        );

        if (result.success) {
          // 设置分数和提交状态
          setScore(result.score || 0);
          setIsSubmitted(true);

          // 提交成功的Toast
          addToast({
            variant: "success",
            message: `测验提交成功`,
          });
        } else {
          // 提交失败的Toast
          addToast({
            variant: "danger",
            message: result.error || "提交失败，请重试",
          });
        }
      } catch (error) {
        console.error("提交测验失败:", error);
        addToast({
          variant: "danger",
          message: "提交失败，请检查网络连接",
        });
      }
    });
  };

  return {
    isLoading: isPending,
    isSubmitted,
    setIsSubmitted,
    calculateScore,
    score,
    handleSubmit,
  };
};

export default useQuizSubmission;
