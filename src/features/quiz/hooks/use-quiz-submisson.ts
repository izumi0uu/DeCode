// hooks/useQuizSubmission.ts
import { useState } from "react";
import { QuestionType, QuizQuestion } from "@/features/types/api/quiz-question";

const useQuizSubmission = (
  quizData: any,
  userAnswers: Record<number, string | string[]>,
  validateAnswers: () => string[]
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

          // 对于只有一个正确答案的多选题，用户只需选择该答案
          if (
            correctAnswers.length === 1 &&
            userAnswer.includes(correctAnswers[0]) &&
            userAnswer.length === 1
          ) {
            totalScore += question.points || 1;
          }
          // 对于有多个正确答案的多选题，用户需要完全匹配所有正确答案
          else if (
            correctAnswers.length > 1 &&
            userAnswer.length === correctAnswers.length &&
            userAnswer.every((answer) => correctAnswers.includes(answer))
          ) {
            totalScore += question.points || 1;
          }
        }
      } else {
        const correctAnswer = question.options
          .find((option: any) => option.isCorrect)
          ?.id.toString();

        if (userAnswer === correctAnswer) {
          totalScore += question.points || 1;
        }
      }
    });

    // 计算百分比分数
    return Math.round((totalScore / totalPoints) * 100);
  };

  const handleSubmit = async () => {
    const errors = validateAnswers();
    if (errors.length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      // 这里可以添加API调用来保存测验结果
      // const response = await submitQuizResult({...});

      // 模拟异步操作
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isSubmitted,
    setIsSubmitted,
    calculateScore,
    handleSubmit,
  };
};

export default useQuizSubmission;
