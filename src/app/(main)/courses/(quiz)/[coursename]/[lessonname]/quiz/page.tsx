// page.tsx
"use client";

import React, { use } from "react";
import { useRouteParams } from "@/lib/utils/route-params";
import { QuizContent } from "@/features/quiz";
import { useQuery } from "@tanstack/react-query";
import Loading from "./loading";
interface PageProps {
  params: {
    coursename: string;
    lessonname: string;
  };
}

const emptyPromise = new Promise((resolve) => {
  // 这里可以放置任何异步操作，或者直接调用resolve
  resolve(null);
});

export default function QuizPage({ params }: PageProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["loading"],
    queryFn: () => new Promise((resolve) => setTimeout(resolve, 200000)), // 模拟2秒的加载时间
  });
  if (isLoading) {
    return <Loading />;
  }
  try {
    const resolvedParams = useRouteParams(params);

    return (
      <QuizContent
        courseSlug={resolvedParams.coursename}
        lessonSlug={resolvedParams.lessonname}
      />
    );
  } catch (error) {
    // 发生错误由error.tsx处理
    throw error;
  }
}
