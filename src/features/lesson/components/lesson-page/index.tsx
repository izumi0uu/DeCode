"use client";

import React from "react";
import { Flex } from "@/once-ui/components";
import { useCurrentLesson } from "../../api/use-get-lesson-preview";
import LessonHeader from "../lesson-header";
import LessonContent from "../lesson-content";
import LessonNavigation from "../lesson-navigation";

interface LessonPageProps {
  coursename: string;
  lessonname: string;
}

export const LessonPage: React.FC<LessonPageProps> = ({
  coursename,
  lessonname,
}) => {
  // 使用自定义hook获取课程和章节数据
  const { data, isLoading, isError } = useCurrentLesson(coursename, lessonname);

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
    throw new Error(`Course '${coursename}' not found`);
  }

  if (!currentLesson) {
    throw new Error(
      `Lesson '${lessonname}' not found in course '${coursename}'`
    );
  }

  return (
    <Flex direction="column" padding="xl">
      <LessonHeader
        title={currentLesson.title}
        description={currentLesson.description}
        duration={currentLesson.duration}
        type={currentLesson.type}
      />

      <LessonContent content="This is where the lesson content would be displayed. In a real application, this would be populated with rich text content, interactive elements, videos, code samples, and other educational materials." />

      <hr
        style={{
          margin: "32px 0 16px",
          border: "none",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      />

      <LessonNavigation
        courseName={currentCourse.slug || currentCourse.id.toString()}
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
