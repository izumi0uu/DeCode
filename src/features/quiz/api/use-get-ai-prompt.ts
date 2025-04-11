import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { AIPromptTemplate } from "@/features/types/api/quiz";

// 定义 AI 模板类型
// 支持对象类型的用户答案
type UserAnswerType =
  | string
  | string[]
  | {
      code: string;
      highlightStart?: number;
      highlightEnd?: number;
    }
  | undefined;

export const useAIFeedback = (
  quizSlug: string,
  userAnswer?: UserAnswerType
) => {
  const [content, setContent] = useState<string>("");
  const [streamStarted, setStreamStarted] = useState<boolean>(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "streaming" | "error"
  >("idle");

  // 初始化 Google AI
  const genAI = new GoogleGenerativeAI(
    process.env.AI_GEMINI_API_KEY || "AIzaSyA3-gECu7JAOZWr_bPOsR6kzOg2yxQyUOg"
  );

  // 获取AI提示模板
  const { data: aiPromptTemplate, isLoading: promptLoading } =
    useGetAIPromptTemplate(quizSlug);

  // 处理用户代码
  const processUserCode = (answer: UserAnswerType): string => {
    if (!answer) return "";

    if (
      typeof answer === "object" &&
      !Array.isArray(answer) &&
      "code" in answer
    ) {
      return answer.code;
    }

    return Array.isArray(answer) ? answer.join("\n") : answer;
  };

  const startStream = async () => {
    setStreamStarted(true);
    try {
      setStatus("loading");

      // 1. 准备模型
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      console.log("model", model);

      // 2. 处理代码内容
      const codeContent = processUserCode(userAnswer);

      // 3. 构建提示 - 替换模板中的 {{code}} 变量
      const promptContent = aiPromptTemplate.content.replace(
        "{{code}}",
        codeContent
      );

      console.log("promptContent", promptContent);

      // 4. 开始流式生成
      const result = await model.generateContentStream(promptContent);

      setStatus("streaming");

      // 5. 处理流
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
    promptLoading,
    streamStarted,
    startStream,
    actualContent: content,
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
        data?.data[0]?.aiPromptTemplate ||
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
