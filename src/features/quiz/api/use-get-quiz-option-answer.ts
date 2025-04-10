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
        throw new Error("cannot get quiz answers");
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
      if (!quizId)
        return "please analyze the following code and provide improvement suggestions:";

      const response = await fetch(
        `/api/quiz-materials/${quizId}?populate=aiPromptTemplate`
      );

      if (!response.ok) {
        throw new Error("cannot get ai prompt template");
      }

      const data = await response.json();
      return (
        data.data?.attributes?.aiPromptTemplate ||
        "please analyze the following code and provide improvement suggestions:"
      );
    },
    enabled: !!quizId,
  });
}
