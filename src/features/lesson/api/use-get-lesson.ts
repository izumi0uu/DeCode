import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { Lesson, LessonLight } from "@/features/types/api/lesson";
import { Course } from "@/features/types/api/course";
import type { HookResponse, ApiDataResponse } from "@/features/types";
import { useCoursesAndLessonsForPreview } from "@/features/home-and-course-preview/api/use-get-courses-lessons";

// 定义包含课程导航所需全部信息的接口
interface LessonWithNavigation {
  currentLesson: Lesson | null;
  currentCourse: Course | null;
  prevLesson: LessonLight | null;
  nextLesson: LessonLight | null;
}

// 通过slug直接获取lesson的content
const fetchLessonContentBySlug = async (
  lessonSlug: string
): Promise<ApiDataResponse<Lesson | null>> => {
  try {
    const queryString = qs.stringify({
      filters: {
        slug: { $eq: lessonSlug },
      },
      populate: {
        course: {
          fields: ["id", "title", "slug"],
        },
      },
      encodeValuesOnly: true,
    });

    const response = await fetch(`/api/lessons?${queryString}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch lesson content: ${response.statusText}`);
    }

    const result = await response.json();

    // Strapi v5 返回扁平化的数据结构
    return {
      data: result.data.length > 0 ? result.data[0] : null,
      meta: {
        isLoading: false,
        isError: false,
        error: null,
      },
    };
  } catch (error) {
    return {
      data: null,
      meta: {
        isLoading: false,
        isError: true,
        error,
      },
    };
  }
};

// 自定义hook，只获取特定章节的content内容，并处理导航信息
export const useGetLessonContent = (
  lessonSlug: string | undefined
): HookResponse<LessonWithNavigation> => {
  const enabled = Boolean(lessonSlug);

  // 获取课程和章节列表数据，用于计算前后章节
  const coursesAndLessons = useCoursesAndLessonsForPreview();

  // 获取章节内容
  const lessonQuery = useQuery({
    queryKey: ["lesson-content", lessonSlug],
    queryFn: () => fetchLessonContentBySlug(lessonSlug as string),
    enabled,
  });

  // 如果任一查询正在加载或出错，则返回相应状态
  const isLoading = lessonQuery.isLoading || coursesAndLessons.isLoading;
  const isError = lessonQuery.isError || coursesAndLessons.isError;
  const error = lessonQuery.error || coursesAndLessons.error;

  // 组装返回数据
  let data: LessonWithNavigation = {
    currentLesson: null,
    currentCourse: null,
    prevLesson: null,
    nextLesson: null,
  };

  // 只有当两个查询都成功完成才处理导航数据
  if (
    !isLoading &&
    !isError &&
    lessonQuery.data?.data &&
    coursesAndLessons.data
  ) {
    const currentLesson = lessonQuery.data.data;
    const currentCourseId = currentLesson.course?.id;

    // 从课程列表中找到当前课程
    const currentCourse = currentCourseId
      ? coursesAndLessons.data.courses.find(
          (course) => course.id === currentCourseId
        ) || null
      : null;

    // 如果找到当前课程，计算前后章节
    if (currentCourse) {
      // 获取当前课程的所有章节并排序
      const courseLessons = coursesAndLessons.data.lessons
        .filter((lesson) => lesson.course?.id === currentCourse.id)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

      // 找到当前章节在列表中的位置
      const currentIndex = courseLessons.findIndex(
        (lesson) => lesson.slug === lessonSlug
      );

      // 计算前后章节
      const prevLesson =
        currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
      const nextLesson =
        currentIndex >= 0 && currentIndex < courseLessons.length - 1
          ? courseLessons[currentIndex + 1]
          : null;

      data = {
        currentLesson,
        currentCourse,
        prevLesson,
        nextLesson,
      };
    }
  }

  return {
    data,
    isLoading,
    isError,
    error,
  };
};
