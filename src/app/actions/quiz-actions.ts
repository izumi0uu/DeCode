"use server";

import { revalidatePath } from "next/cache";
import { QuestionType, QuizQuestion } from "@/features/types/api/quiz-question";

export async function submitQuizAnswer(
  lessonSlug: string,
  userAnswers: Record<number, string | string[]>,
  questions: QuizQuestion[]
) {
  try {
    // 计算分数
    let totalScore = 0;
    let totalPoints = 0;

    questions.forEach((question) => {
      totalPoints += question.points || 1;

      const userAnswer = userAnswers[question.id];
      if (!userAnswer) return;

      if (question.type === QuestionType.MULTIPLE_CHOICE) {
        if (Array.isArray(userAnswer)) {
          const correctAnswers = question.options
            .filter((option) => option.isCorrect)
            .map((option) => option.id.toString());

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
      } else {
        const correctAnswer = question.options
          .find((option) => option.isCorrect)
          ?.id.toString();

        if (userAnswer === correctAnswer) {
          totalScore += question.points || 1;
        }
      }
    });

    const scorePercentage = Math.round((totalScore / totalPoints) * 100);

    // 这里可以添加实际的API调用，保存测验结果到数据库
    // 模拟服务器处理延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 重新验证路径以更新数据
    revalidatePath(`/courses/*/lessons/${lessonSlug}`);

    return {
      success: true,
      score: scorePercentage,
    };
  } catch (error) {
    console.error("submit quiz failed:", error);
    return {
      success: false,
      error: "something went wrong",
    };
  }
}
