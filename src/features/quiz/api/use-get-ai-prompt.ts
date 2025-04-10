import { useQuery } from "@tanstack/react-query";

// 获取AI提示模板
export function useGetAIPromptTemplate(quizId: number) {
  return useQuery({
    queryKey: ["ai-prompt-template", quizId],
    queryFn: async () => {
      if (!quizId)
        return "please analyze the following code and provide improvement suggestions:";

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quiz-materials/${quizId}?populate=aiPromptTemplate`
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
