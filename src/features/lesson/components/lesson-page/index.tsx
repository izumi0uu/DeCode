"use client";

import React, { useState, useEffect } from "react";
import { Flex, Button } from "@/once-ui/components";
import { useGetLessonContent } from "../../api/use-get-lesson";
import LessonHeader from "../lesson-header";
import LessonContent from "../lesson-content";
import LessonNavigation from "../lesson-navigation";
import Link from "next/link";

interface LessonPageProps {
  coursename?: string;
  lessonSlug: string;
}

export const LessonPage: React.FC<LessonPageProps> = ({ lessonSlug }) => {
  // 使用自定义hook获取课程和章节数据
  const { data, isLoading, isError } = useGetLessonContent(lessonSlug);
  // 状态用于控制是否显示测验按钮
  const [hasQuiz, setHasQuiz] = useState(false);

  // 检查该课程是否有测验
  useEffect(() => {
    if (data?.currentLesson?.id) {
      // 这里可以调用API检查是否有测验
      // 示例实现：调用API检查
      const checkQuiz = async () => {
        try {
          const response = await fetch(
            `/api/lessons/${data?.currentLesson?.id}/has-quiz`
          );
          if (response.ok) {
            const result = await response.json();
            setHasQuiz(!!result.hasQuiz);
          }
        } catch (error) {
          console.error("Failed to check quiz:", error);
          // 作为示例，我们假设每个课程都有测验
          setHasQuiz(true);
        }
      };

      checkQuiz();
    }
  }, [data?.currentLesson?.id]);

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

  const courseSlug = currentCourse.slug || currentCourse.id.toString();

  return (
    <Flex direction="column" padding="xl">
      <LessonHeader
        title={currentLesson.title}
        description={currentLesson.description}
        duration={currentLesson.duration}
        type={currentLesson.type}
      />

      <LessonContent content={currentLesson.content} />

      {/* 测验按钮 */}
      {hasQuiz || (
        <Flex
          center
          style={{
            marginTop: "32px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "24px",
          }}
        >
          <Link
            href={`/courses/${courseSlug}/${lessonSlug}/quiz`}
            style={{ textDecoration: "none" }}
          >
            <Button
              variant="primary"
              size="l"
              style={{
                padding: "0 32px",
                background:
                  "linear-gradient(90deg, rgba(64, 93, 230, 0.8) 0%, rgba(88, 81, 219, 0.8) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
              }}
            >
              Start a quiz
            </Button>
          </Link>
        </Flex>
      )}

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
