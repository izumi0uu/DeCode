import { useQuery } from "@tanstack/react-query";

export const useGetAIPromptTemplate = (quizId: number) => {
  return useQuery({
    queryKey: ["ai-prompt-template", quizId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quiz-materials/${quizId}?populate=aiPromptTemplate`
      );

      if (!response.ok) {
        throw new Error("无法获取AI提示模板");
      }

      const data = await response.json();
      return (
        data.data.attributes.aiPromptTemplate ||
        "请分析这段代码并提供改进建议："
      );
    },
    enabled: !!quizId,
  });
};
