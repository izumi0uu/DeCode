import { GoogleGenerativeAI } from "@google/generative-ai";
import { Bubble } from "@ant-design/x";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";

export const useAIFeedback = (
  quizSlug: string,
  userAnswer?: string | string[]
) => {
  const [content, setContent] = useState<string>("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "streaming" | "error"
  >("idle");

  // 初始化 Google AI
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_KEY!);

  // 获取AI提示模板
  const { data: promptTemplate, isLoading: promptLoading } =
    useGetAIPromptTemplate(quizSlug);

  const startStream = async () => {
    if (!userAnswer || !promptTemplate) return;

    try {
      setStatus("loading");

      // 1. 准备模型
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // 2. 构建提示
      const prompt = `${promptTemplate.content}\n\nCode:\n${
        Array.isArray(userAnswer) ? userAnswer.join("\n") : userAnswer
      }`;

      // 3. 开始流式生成
      const result = await model.generateContentStream(prompt);

      setStatus("streaming");

      // 4. 使用 Ant Design X 的 Bubble 组件处理流
      let fullResponse = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        setContent(fullResponse);
      }

      setStatus("idle");
    } catch (error) {
      console.error("AI Stream Error:", error);
      setStatus("error");
    }
  };

  return {
    promptTemplate,
    promptLoading,
    startStream,
    content,
    status,
  };
};

// 获取AI提示模板
export function useGetAIPromptTemplate(quizSlug: string) {
  const fetchAIPromptTemplate = async () => {
    if (!quizSlug)
      return "please analyze the following code and provide improvement suggestions:";

    try {
      const queryString = qs.stringify({
        populate: ["aiPromptTemplate"],
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/?${queryString}`
      );

      if (!response.ok) {
        throw new Error("cannot get ai prompt template");
      }

      const data = await response.json();
      return (
        data.data?.aiPromptTemplate ||
        "please analyze the following code and provide improvement suggestions:"
      );
    } catch (error) {
      console.error("AI Stream Error:", error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ["ai-prompt-template", quizSlug],
    queryFn: fetchAIPromptTemplate,
  });
}
