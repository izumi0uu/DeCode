// page.tsx
"use client";

import React, { Suspense } from "react";
import { useRouteParams } from "@/lib/utils/route-params";
import { QuizContent } from "@/features/quiz";

interface PageProps {
  params: {
    coursename: string;
    lessonname: string;
  };
}

export default function QuizPage({ params }: PageProps) {
  try {
    const resolvedParams = useRouteParams(params);

    return (
      <Suspense fallback={<div>Fallback UI</div>}>
        <QuizContent
          courseSlug={resolvedParams.coursename}
          lessonSlug={resolvedParams.lessonname}
        />
      </Suspense>
    );
  } catch (error) {
    // 发生错误由error.tsx处理
    throw error;
  }
}
