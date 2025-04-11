"use client";

import { useState, useEffect } from "react";
import { useGetAIPromptTemplate } from "@/features/quiz/api/use-get-ai-prompt";
import { useStream } from "./use-stream";

export const useAIFeedback = (
  quizId: number | string,
  questionId: string,
  userAnswer?: string | string[]
) => {
  const [streamStarted, setStreamStarted] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  // 获取AI提示模板
  const { data: promptTemplate, isLoading: promptLoading } =
    useGetAIPromptTemplate(Number(quizId));

  // 初始化流
  const startStream = async () => {
    if (streamStarted || !userAnswer || !promptTemplate) return;

    setStreamStarted(true);

    try {
      const response = await fetch("/api/ai-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptTemplate,
          code: Array.isArray(userAnswer) ? userAnswer.join("\n") : userAnswer,
          questionId: questionId,
        }),
      });

      if (!response.ok) throw new Error("Stream request failed");

      // 设置流URL
      setStreamUrl(response.url);
    } catch (err) {
      console.error("启动流失败:", err);
      setStreamStarted(false);
    }
  };

  useEffect(() => {
    if (promptTemplate && userAnswer && !streamStarted) {
      startStream();
    }
  }, [promptTemplate, userAnswer, streamStarted]);

  // 使用指定格式处理流数据
  const { data, status } = useStream(streamUrl);

  const actualContent =
    typeof data === "string" ? data : data?.content || "正在生成AI反馈...";

  return {
    promptTemplate,
    promptLoading,
    streamStarted,
    startStream,
    actualContent,
    status,
  };
};
