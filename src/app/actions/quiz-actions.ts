// app/actions/quiz-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { XRequest, XStream } from "@ant-design/x";
// import { GoogleGenAi } from "@google-genai";
import qs from "qs";

import { QuestionType, QuizQuestion } from "@/features/types/api/quiz-question";

// 表单处理Server Action
export async function submitQuizAnswer(
  lessonSlug: string,
  userAnswers: Record<number, string | string[]>,
  questions: QuizQuestion[]
) {
  try {
    // 提取代码题
    const codeQuestions = questions
      .filter((q) => q.type === QuestionType.PROGRAMMING)
      .map((q) => ({
        id: q.id,
        code: Array.isArray(userAnswers[q.id])
          ? (userAnswers[q.id] as string[]).join("\n")
          : (userAnswers[q.id] as string),
      }));

    // 从 with-answers API 获取包含正确答案的题目
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

    const answersResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes?${queryString}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!answersResponse.ok) {
      throw new Error("无法获取测验答案");
    }

    const answersData = await answersResponse.json();
    const quizWithAnswers = answersData.data[0];

    // 如果没有找到测验
    if (!quizWithAnswers) {
      throw new Error(`未找到lessonSlug为${lessonSlug}的测验`);
    }

    // 计算分数
    let totalScore = 0;
    let totalPoints = 0;
    const questionResponses = [];

    // 遍历问题计算分数
    for (const question of questions) {
      // 跳过代码题，因为需要AI评分
      if (question.type === QuestionType.PROGRAMMING) continue;

      totalPoints += question.points || 1;
      const userAnswer = userAnswers[question.id];

      if (!userAnswer) continue; // 未回答的题目

      // 从quizWithAnswers中找到对应的问题和选项
      const questionWithAnswers =
        quizWithAnswers.attributes.questions.data.find(
          (q: any) => q.id === question.id
        );

      if (!questionWithAnswers) continue;

      const options = questionWithAnswers.attributes.options.data;
      const correctOptions = options.filter(
        (opt: any) => opt.attributes.isCorrect
      );

      let isCorrect = false;

      if (question.type === QuestionType.MULTIPLE_CHOICE) {
        // 处理多选题
        if (Array.isArray(userAnswer)) {
          const correctOptionIds = correctOptions.map((opt: any) =>
            opt.id.toString()
          );

          // 单选情况
          if (
            correctOptionIds.length === 1 &&
            userAnswer.includes(correctOptionIds[0]) &&
            userAnswer.length === 1
          ) {
            isCorrect = true;
            totalScore += question.points || 1;
          }
          // 多选情况 - 需要完全匹配所有正确选项
          else if (
            correctOptionIds.length > 1 &&
            userAnswer.length === correctOptionIds.length &&
            userAnswer.every((answer) => correctOptionIds.includes(answer))
          ) {
            isCorrect = true;
            totalScore += question.points || 1;
          }
        }
      } else {
        // 处理单选题
        const correctOptionId = correctOptions[0]?.id.toString();
        isCorrect = userAnswer === correctOptionId;

        if (isCorrect) {
          totalScore += question.points || 1;
        }
      }

      // 保存用户对该题的回答
      questionResponses.push({
        questionId: question.id,
        selectedOptions: userAnswer,
        isCorrect,
      });
    }

    const scorePercentage =
      totalPoints > 0 ? Math.round((totalScore / totalPoints) * 100) : 0;

    // 将答案保存到数据库
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz-answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          lesson: lessonSlug,
          answers: JSON.stringify(userAnswers),
          score: scorePercentage,
          questionResponses: JSON.stringify(questionResponses),
        },
      }),
    });

    // 重新验证路径，确保结果页面获取最新数据
    revalidatePath(`/courses/*/${lessonSlug}/quiz/result`);

    // 确保正确的路径格式，不使用courseSlug变量
    revalidatePath(`/courses/*/${lessonSlug}`);

    return {
      success: true,
      score: scorePercentage,
      hasCodeQuestions: codeQuestions.length > 0,
    };
  } catch (error) {
    console.error("提交测验失败:", error);
    return {
      success: false,
      error: "提交过程中出现错误",
    };
  }
}

// 处理AI请求并创建流式响应的Server Action
// 调用大模型API并流式返回结果
// 创建流式文本生成函数
export async function streamGeminiResponse(
  promptTemplate: string,
  code: string,
  questionId: number
) {
  // 创建一个可读流，将Gemini的响应传递给客户端
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // 初始化Gemini API
        // 注意：需要正确安装和导入GoogleGenAi
        // const genAI = new GoogleGenAi({
        //   apiKey: process.env.AI_GEMINI_API_KEY,
        // });
        // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // 使用适当的API客户端替代
        // 这里仅作为示例，实际实现需要根据您的项目配置

        // 准备提示
        const fullPrompt = `${promptTemplate}\n\n${code}`;

        // 创建模拟响应以避免错误
        // 实际项目中应根据正确的API实现
        const mockResponse = "代码分析结果将在这里显示...";

        // 发送到客户端
        controller.enqueue(
          new TextEncoder().encode(
            JSON.stringify({
              questionId,
              content: mockResponse,
              done: false,
            })
          )
        );

        // 完成信号
        controller.enqueue(
          new TextEncoder().encode(
            JSON.stringify({
              questionId,
              done: true,
            })
          )
        );

        controller.close();
      } catch (error) {
        console.error("Stream error:", error);
        controller.enqueue(
          new TextEncoder().encode(
            JSON.stringify({
              questionId,
              error: true,
              message: (error as Error).message,
              done: true,
            })
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream);
}
