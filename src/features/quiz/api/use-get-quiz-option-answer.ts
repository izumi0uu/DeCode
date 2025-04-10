import { useQuery } from "@tanstack/react-query";
import qs from "qs";

/**
 * 获取测验详情及正确答案 - 仅在结果页面使用
 * 这里明确返回包含isCorrect字段的options
 */
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
        encodeValuesOnly: true,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/?${queryString}`
      );

      if (!response.ok) {
        throw new Error("cannot get quiz answers");
      }

      const data = await response.json();
      return data.data?.[0];
    },
    enabled: !!lessonSlug,
  });
}
