import React from "react";
import { LessonPage } from "@/features/lesson/components/lesson-page";

export default function LessonPageRoute({
  params,
}: {
  params: Promise<{ coursename: string; lessonname: string }>;
}) {
  // 使用 React.use() 解包params参数
  const unwrappedParams = React.use(params);
  const lessonSlug = unwrappedParams.lessonname;

  return <LessonPage lessonSlug={lessonSlug} />;
}
