"use client";

import React from "react";
import { Flex } from "@/once-ui/components";
import { useGetLessonContent } from "../../api/use-get-lesson";
import LessonHeader from "../lesson-header";
import LessonContent from "../lesson-content";
import LessonNavigation from "../lesson-navigation";

interface LessonPageProps {
  coursename?: string;
  lessonSlug: string;
}

export const LessonPage: React.FC<LessonPageProps> = ({ lessonSlug }) => {
  // 使用自定义hook获取课程和章节数据
  const { data, isLoading, isError } = useGetLessonContent(lessonSlug);

  console.log(data);

  // 处理加载状态 - 这应该由 loading.tsx 处理
  if (isLoading) {
    return null; // 返回null让Next.js使用loading.tsx
  }

  // 处理错误状态 - 这应该由 error.tsx 处理
  if (isError || !data) {
    throw new Error("Failed to load lesson data");
  }

  const { currentCourse, currentLesson, prevLesson, nextLesson } = data;

  if (!currentCourse) {
    throw new Error(`Course not found for lesson ${lessonSlug}`);
  }

  if (!currentLesson) {
    throw new Error(`Lesson with slug ${lessonSlug} not found`);
  }

  // 使用从API获取的coursename，而不是props中的
  const courseSlug = currentCourse.slug || currentCourse.id.toString();

  return (
    <Flex direction="column" padding="xl">
      <LessonHeader
        title={currentLesson.title}
        description={currentLesson.description}
        duration={currentLesson.duration}
        type={currentLesson.type}
      />

      <LessonContent content={currentLesson.content} contentType="blocks" />

      <hr
        style={{
          margin: "32px 0 16px",
          border: "none",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      />

      <LessonNavigation
        courseName={courseSlug}
        prevLesson={
          prevLesson
            ? {
                slug: prevLesson.slug || prevLesson.id.toString(),
                title: prevLesson.title,
              }
            : undefined
        }
        nextLesson={
          nextLesson
            ? {
                slug: nextLesson.slug || nextLesson.id.toString(),
                title: nextLesson.title,
              }
            : undefined
        }
      />
    </Flex>
  );
};

export default LessonPage;
