import { NextRequest, NextResponse } from "next/server";

// 获取测验及选项（包含正确答案）
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const queryString = url.search;

    // 调用Strapi API获取数据，包含isCorrect字段
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
      throw new Error("Failed to fetch quiz data with answers");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Quiz with answers API error:", error);
    return NextResponse.json(
      { error: "Failed to get quiz data with answers" },
      { status: 500 }
    );
  }
}
