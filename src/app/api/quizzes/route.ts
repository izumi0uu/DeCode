import { NextRequest, NextResponse } from "next/server";

// 获取测验及选项（过滤掉正确答案）
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const queryString = url.search;

    // 调用Strapi API获取数据
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes${queryString}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        next: { revalidate: 60 }, // 缓存60秒
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch quiz data");
    }

    // 获取原始数据
    const data = await response.json();

    // 处理数据，过滤掉isCorrect字段
    if (data.data && Array.isArray(data.data)) {
      data.data = data.data.map((quiz: any) => {
        if (quiz.attributes?.questions?.data) {
          quiz.attributes.questions.data = quiz.attributes.questions.data.map(
            (question: any) => {
              if (question.attributes?.options?.data) {
                question.attributes.options.data =
                  question.attributes.options.data.map((option: any) => {
                    // 删除isCorrect字段
                    if (
                      option.attributes &&
                      option.attributes.isCorrect !== undefined
                    ) {
                      const { isCorrect, ...rest } = option.attributes;
                      option.attributes = rest;
                    }
                    return option;
                  });
              }
              return question;
            }
          );
        }
        return quiz;
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Quiz API error:", error);
    return NextResponse.json(
      { error: "Failed to get quiz data" },
      { status: 500 }
    );
  }
}
