import React from "react";
import LessonPageClient from "./client";

export default function LessonPage({
  params,
}: {
  params: Promise<{ coursename: string; lessonname: string }>;
}) {
  // 使用 React.use() 解包params参数
  const unwrappedParams = React.use(params);
  const coursename = unwrappedParams.coursename;
  const lessonname = unwrappedParams.lessonname;

  // 使用客户端组件包装器来使用useCoursesAndLessonsForPreview钩子
  return <LessonPageClient coursename={coursename} lessonname={lessonname} />;
}
