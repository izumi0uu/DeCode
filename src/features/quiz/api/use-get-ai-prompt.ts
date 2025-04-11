import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { AIPromptTemplate, Quiz } from "@/features/types/api/quiz";

// 支持对象类型的用户答案
type UserAnswerType =
  | string
  | string[]
  | {
      code: string;
      highlightStart?: number;
      highlightEnd?: number;
      id?: string | number;
    }
  | undefined;

// 扩展题目类型
interface QuestionData {
  id: string | number;
  title: string;
  question: string;
  type: string;
  codeTemplate?: string;
}

export const useAIFeedback = (
  quizSlug: string,
  userAnswer?: UserAnswerType
) => {
  const [content, setContent] = useState<string>("");
  const [streamStarted, setStreamStarted] = useState<boolean>(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "streaming" | "error" | "success"
  >("idle");
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);

  // 初始化 Google AI
  const genAI = new GoogleGenerativeAI(
    process.env.NEXT_PUBLIC_GOOGLE_AI_KEY ||
      "AIzaSyA3-gECu7JAOZWr_bPOsR6kzOg2yxQyUOg"
  );

  // 获取AI提示模板
  const { data: promptData, isLoading: promptLoading } =
    useGetAIPromptTemplate(quizSlug);

  // 从本地存储获取题目信息
  useEffect(() => {
    if (!userAnswer) return; // 如果没有用户答案，直接返回

    console.log("useEffect触发，userAnswer:", JSON.stringify(userAnswer));

    const loadQuestionData = () => {
      try {
        console.log("开始加载题目数据", { quizSlug });
        // 获取题目数据
        const storedQuestions = localStorage.getItem(
          `quiz_questions_${quizSlug}`
        );

        if (!storedQuestions) {
          console.log("未找到题目数据");
          return;
        }

        console.log("成功获取题目数据");
        const questions = JSON.parse(storedQuestions);

        // 根据问题ID查找
        let questionId = "";

        // 获取问题ID
        if (
          typeof userAnswer === "object" &&
          !Array.isArray(userAnswer) &&
          "id" in userAnswer
        ) {
          questionId = String(userAnswer.id);
        }

        console.log("查找题目，ID:", questionId);

        // 如果没有ID，则不进行匹配
        if (!questionId) {
          console.log("没有题目ID，无法匹配题目");
          return;
        }

        // 打印所有题目信息用于调试
        console.log("所有题目:", JSON.stringify(questions));

        // 尝试多种方式查找题目
        let currentQuestion = null;
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          console.log(
            `题目[${i}]:`,
            q.id,
            typeof q.id,
            "对比",
            questionId,
            typeof questionId
          );

          // 转换为字符串比较
          if (String(q.id) === String(questionId)) {
            console.log("找到匹配题目:", q);
            currentQuestion = q;
            break;
          }
        }

        if (currentQuestion) {
          setQuestionData(currentQuestion);
        } else {
          console.log("未找到匹配题目");
        }
      } catch (error) {
        console.error("加载题目数据失败:", error);
      }
    };

    loadQuestionData();
  }, [quizSlug, userAnswer]);

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
    if (!userAnswer || !promptData?.aiPromptTemplate?.content) {
      console.log("Missing user answer or prompt template");
      return;
    }

    // 如果已经开始流式生成，不要重复触发
    if (streamStarted) {
      console.log("Stream already started, skipping");
      return;
    }

    setStreamStarted(true);

    try {
      setStatus("loading");

      // 1. 准备模型
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // 2. 处理代码内容
      const codeContent = processUserCode(userAnswer);

      // 3. 构建完整提示，包含题目和代码
      let promptContent = promptData.aiPromptTemplate.content;
      console.log("promptContent", promptContent);
      console.log("questionData", questionData);
      console.log("userAnswer", userAnswer);
      // 替换题目描述
      if (questionData) {
        promptContent = promptContent.replace(
          "{{question}}",
          questionData.question || questionData.title
        );
      }

      // 替换代码模板（如果存在）
      if (questionData?.codeTemplate) {
        promptContent = promptContent.replace(
          "{{template}}",
          questionData.codeTemplate
        );
      }

      // 替换用户代码
      promptContent = promptContent.replace("{{code}}", codeContent);

      console.log("Final prompt:", promptContent);

      // 4. 开始流式生成
      const result = await model.generateContentStream(promptContent);

      setStatus("streaming");

      // 5. 处理流 - 优化版本，减少更新频率
      let fullResponse = "";
      let lastUpdateTime = 0;
      const UPDATE_INTERVAL = 150; // 至少间隔150ms更新一次UI

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;

        const now = Date.now();
        if (now - lastUpdateTime > UPDATE_INTERVAL) {
          setContent(fullResponse);
          lastUpdateTime = now;
        }
      }

      // 确保最后一次更新包含完整内容
      setContent(fullResponse);

      setStatus("success");
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
    questionData,
  };
};

// 获取AI提示模板
export function useGetAIPromptTemplate(quizSlug: string) {
  const fetchAIPromptTemplate = async (): Promise<Quiz | null> => {
    if (!quizSlug) return null;

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
      return data.data[0];
    } catch (error) {
      console.error("AI Template Error:", error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ["ai-prompt-template", quizSlug],
    queryFn: fetchAIPromptTemplate,
    staleTime: 1000 * 60 * 5, // 5分钟内不重新获取数据
    gcTime: 1000 * 60 * 30, // 30分钟内缓存数据
  });
}

// 保存题目到localStorage的辅助函数
export function saveQuestionsToLocalStorage(
  quizSlug: string,
  questions: any[]
) {
  try {
    localStorage.setItem(
      `quiz_questions_${quizSlug}`,
      JSON.stringify(questions)
    );
    console.log("保存题目到本地存储成功");
  } catch (error) {
    console.error("保存题目到本地存储失败:", error);
  }
}
