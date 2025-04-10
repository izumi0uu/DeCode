import { useQuery } from "@tanstack/react-query";
import qs from "qs";

// 获取测验详情及正确答案
export function useGetQuizAnswers(lessonSlug: string) {
  return useQuery({
    queryKey: ["quiz-option-answers", lessonSlug],
    queryFn: async () => {
      const queryString = qs.stringify({
        filters: {
          lesson: {
            slug: {
              $eq: lessonSlug,
            },
          },
        },
        populate: {
          questions: {
            populate: ["options"],
          },
        },
      });

      const response = await fetch(`/api/quizzes?${queryString}`);

      if (!response.ok) {
        throw new Error("无法获取测验答案");
      }

      const data = await response.json();
      return data.data?.[0];
    },
    enabled: !!lessonSlug,
  });
}

// 获取AI提示模板
export function useGetAIPromptTemplate(quizId: number) {
  return useQuery({
    queryKey: ["ai-prompt-template", quizId],
    queryFn: async () => {
      if (!quizId) return "请分析以下代码并提供改进建议：";

      const response = await fetch(
        `/api/quiz-materials/${quizId}?populate=aiPromptTemplate`
      );

      if (!response.ok) {
        throw new Error("无法获取AI提示模板");
      }

      const data = await response.json();
      return (
        data.data?.attributes?.aiPromptTemplate ||
        "请分析以下代码并提供改进建议："
      );
    },
    enabled: !!quizId,
  });
}
