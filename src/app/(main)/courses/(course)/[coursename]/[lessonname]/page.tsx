import React from "react";
import { LessonPage } from "@/features/lesson/components/lesson-page";

export default function LessonPageRoute({
  params,
}: {
  params: Promise<{ coursename: string; lessonname: string }>;
}) {
  // 使用 React.use() 解包params参数
  const unwrappedParams = React.use(params);
  const coursename = unwrappedParams.coursename;
  const lessonname = unwrappedParams.lessonname;

  return <LessonPage coursename={coursename} lessonname={lessonname} />;
}
