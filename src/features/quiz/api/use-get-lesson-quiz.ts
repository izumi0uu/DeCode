import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
// @ts-ignore
import qs from "qs";
import { Quiz, QuizListResponse, HookResponse } from "@/features/types";
import { QuizQuestion } from "@/features/types/api/quiz-question";
import { QuizOption } from "@/features/types/api/quiz-option";

/**
 * 获取特定课程章节的测验数据
 * @param lessonSlug 章节的slug (URL标识符)
 * @returns Quiz 数据及加载状态
 */
export const useGetLessonQuiz = (
  lessonSlug: string | undefined
): HookResponse<Quiz | null> => {
  const fetchLessonQuiz = async (): Promise<Quiz | null> => {
    if (!lessonSlug) return null;

    try {
      // 构建查询参数，包含问题和选项
      const queryString = qs.stringify({
        filters: {
          lesson: {
            slug: {
              $eq: lessonSlug,
            },
          },
        },
        populate: {
          questions: {
            sort: ["position:asc"],
            populate: ["options"],
          },
        },
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes?${queryString}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch quiz for lesson: ${lessonSlug}`);
      }

      const result = (await response.json()) as QuizListResponse;

      // 处理没有找到测验的情况
      if (result.data.length === 0) {
        return null;
      }

      // 返回找到的第一个测验（通常一个课程章节只有一个测验）
      return result.data[0];
    } catch (error) {
      console.error("Error fetching lesson quiz:", error);
      throw error;
    }
  };

  const query = useSuspenseQuery({
    queryKey: ["lesson-quiz", lessonSlug],
    queryFn: fetchLessonQuiz,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

/**
 * 获取特定章节测验的详细数据，包括所有问题和选项
 * 此函数适用于需要完整测验数据展示的场景
 * 注意：此API不会返回isCorrect字段，确保答案安全
 */
export const useGetLessonQuizDetailed = (
  lessonSlug: string | undefined
): HookResponse<Quiz | null> => {
  const fetchQuizDetailed = async (): Promise<Quiz | null> => {
    if (!lessonSlug) return null;

    try {
      // 构建包含完整问题和选项的查询参数
      const queryString = qs.stringify({
        filters: {
          lesson: {
            slug: {
              $eq: lessonSlug,
            },
          },
        },
        populate: {
          lesson: {
            fields: ["id", "title", "slug"],
          },
          questions: {
            populate: {
              options: {
                fields: ["id", "text", "locale", "explanation"],
              },
            },
          },
        },
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes?${queryString}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch detailed quiz for lesson: ${lessonSlug}`
        );
      }

      const result = (await response.json()) as QuizListResponse;

      if (result.data.length === 0) {
        return null;
      }

      return result.data[0];
    } catch (error) {
      console.error("Error fetching detailed quiz:", error);
      throw error;
    }
  };

  const query = useSuspenseQuery({
    queryKey: ["lesson-quiz-detailed", lessonSlug],
    queryFn: fetchQuizDetailed,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
