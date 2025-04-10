import { NextRequest } from "next/server";
import { streamGeminiResponse } from "@/app/actions/quiz-actions";

export const POST = async (request: NextRequest) => {
  try {
    const { promptTemplate, code, questionId } = await request.json();

    // 使用Server Action处理流式响应
    const stream = await streamGeminiResponse(promptTemplate, code, questionId);
    return stream;
  } catch (error) {
    console.error("AI Stream API error:", error);

    // 创建一个错误流响应
    const errorStream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(
            JSON.stringify({
              error: true,
              message:
                (error as Error).message || "Failed to process AI stream",
              done: true,
            })
          )
        );
        controller.close();
      },
    });

    return new Response(errorStream);
  }
};

// 配置路由选项 - 禁用响应缓存以确保实时流
export const dynamic = "force-dynamic";
