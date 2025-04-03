// src/features/home-and-course-preview/api/use-get-courses-lessons.ts
import { useQuery } from "@tanstack/react-query";
import { CourseResponse, LessonResponse, NavNode } from "@/features/types";
// @ts-ignore
import qs from "qs"; // 添加ts-ignore以临时解决qs模块类型声明问题
import type {
  CourseListResponse,
  LessonLightListResponse,
  LessonLight,
  Course,
} from "@/features/types";
import {
  LESSON_LIGHT_FIELDS,
  COURSE_LIGHT_FIELDS,
  QUIZ_LIGHT_FIELDS,
  ApiDataResponse,
  HookResponse,
} from "@/features/types";
import { fetchAllPages } from "@/lib/utils/fetchAllPages";

// 获取课程数据
const fetchCourses = async (): Promise<ApiDataResponse<Course[]>> => {
  try {
    const response = await fetch("/api/courses");
    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }
    const result = (await response.json()) as CourseListResponse;
    return {
      data: result.data,
      meta: {
        isLoading: false,
        isError: false,
        error: null,
      },
    };
  } catch (error) {
    return {
      data: [],
      meta: {
        isLoading: false,
        isError: true,
        error,
      },
    };
  }
};

// 获取不含content的章节数据
const fetchLessonsLight = async (): Promise<ApiDataResponse<LessonLight[]>> => {
  try {
    // 构建查询参数，排除 content 字段
    const queryParams = {
      fields: LESSON_LIGHT_FIELDS,
      populate: {
        course: {
          fields: COURSE_LIGHT_FIELDS,
        },
        quizzes: {
          fields: QUIZ_LIGHT_FIELDS,
        },
      },
    };

    // 使用工具函数获取所有分页数据
    const result = await fetchAllPages<LessonLight>(
      "/api/lessons",
      queryParams
    );
    return {
      data: result.data,
      meta: {
        isLoading: false,
        isError: false,
        error: null,
      },
    };
  } catch (error) {
    return {
      data: [],
      meta: {
        isLoading: false,
        isError: true,
        error,
      },
    };
  }
};

// 为课程预览卡片组织的数据结构
interface CoursesAndLessonsPreview {
  courses: Course[];
  lessons: LessonLight[];
  coursesWithLessons: Array<Course & { lessons: LessonLight[] }>;
}

// 获取用于预览卡片的课程和章节数据
const fetchCoursesAndLessonsForPreview = async (): Promise<
  ApiDataResponse<CoursesAndLessonsPreview>
> => {
  try {
    const [coursesResponse, lessonsResponse] = await Promise.all([
      fetchCourses(),
      fetchLessonsLight(),
    ]);

    if (coursesResponse.meta.isError || lessonsResponse.meta.isError) {
      throw new Error("Failed to fetch data");
    }

    // 将章节按课程分组
    const lessonsByCourse = lessonsResponse.data.reduce((acc, lesson) => {
      const courseId = lesson.course?.id;
      if (courseId) {
        if (!acc[courseId]) {
          acc[courseId] = [];
        }
        acc[courseId].push(lesson);
      }
      return acc;
    }, {} as Record<number, LessonLight[]>);

    // 为每个课程添加其关联的章节
    const coursesWithLessons = coursesResponse.data.map((course) => {
      return {
        ...course,
        lessons: lessonsByCourse[course.id] || [],
      } as Course & { lessons: LessonLight[] };
    });

    return {
      data: {
        courses: coursesResponse.data,
        lessons: lessonsResponse.data,
        coursesWithLessons,
      },
      meta: {
        isLoading: false,
        isError: false,
        error: null,
      },
    };
  } catch (error) {
    return {
      data: {
        courses: [],
        lessons: [],
        coursesWithLessons: [],
      },
      meta: {
        isLoading: false,
        isError: true,
        error,
      },
    };
  }
};

// 转换数据为导航树结构
const transformData = (
  courses: Course[],
  lessons: LessonLight[]
): NavNode[] => {
  try {
    // 创建课程导航节点
    const courseNodes: NavNode[] = courses.map((course) => {
      // 查找属于当前课程的所有章节
      const courseId = course.id;
      const courseLessons = lessons.filter(
        (lesson) => lesson.course?.id === courseId
      );

      // 为每个章节创建子节点
      const lessonNodes: NavNode[] = courseLessons.map((lesson) => ({
        id: lesson.id.toString(),
        title: lesson.title,
        path: `/courses/${course.slug}/${lesson.slug}`,
        type: "lesson",
        sortOrder: lesson.sortOrder || 0,
        metadata: {
          courseId: courseId,
          lessonId: lesson.id,
          progress: 0, // 默认值
          studyTime: lesson.duration || 0,
          status: "published", // 简化处理，默认为published
          lang: course.locale || "en", // 从课程获取
        },
      }));

      // 返回课程节点，包含章节子节点
      return {
        id: courseId.toString(),
        title: course.title,
        path: `/courses/${course.slug}`, // 使用 slug 而非标题转换
        type: "course",
        children: lessonNodes.length > 0 ? lessonNodes : undefined,
        sortOrder: 0,
        metadata: {
          courseId: courseId,
          difficulty: course.difficulty || "beginner",
          progress: 0, // 默认值
          learners: 0, // 默认值
          studyTime: course.duration || 0,
          status: "published", // 简化处理，默认为published
          lang: course.locale || "en",
        },
      };
    });

    return courseNodes;
  } catch (error) {
    console.error("Error transforming data:", error);
    return [];
  }
};

// 自定义 hook，获取课程和章节数据并转换为导航树
export const useCoursesAndLessons = (): HookResponse<NavNode[]> => {
  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const lessonsQuery = useQuery({
    queryKey: ["lessons-light"],
    queryFn: fetchLessonsLight,
    enabled: !!coursesQuery.data, // 只有在课程数据加载完成后才加载章节数据
  });

  // 当两个查询都完成时，转换数据
  const isLoading = coursesQuery.isLoading || lessonsQuery.isLoading;
  const isError = coursesQuery.isError || lessonsQuery.isError;
  const error = coursesQuery.error || lessonsQuery.error;

  let data: NavNode[] = [];

  if (coursesQuery.data && lessonsQuery.data) {
    data = transformData(coursesQuery.data.data, lessonsQuery.data.data);
  }

  return {
    isLoading,
    isError,
    error,
    data,
  };
};

// 自定义hook，获取用于预览卡片的课程和章节数据
export const useCoursesAndLessonsForPreview =
  (): HookResponse<CoursesAndLessonsPreview> => {
    const query = useQuery({
      queryKey: ["courses-lessons-preview"],
      queryFn: fetchCoursesAndLessonsForPreview,
    });

    return {
      data: query.data?.data,
      isLoading: query.isLoading,
      isError: query.isError,
      error: query.error,
    };
  };

export const useCourses = (): HookResponse<Course[]> => {
  const query = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  return {
    data: query.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

export const useLessons = (): HookResponse<LessonLight[]> => {
  const query = useQuery({
    queryKey: ["lessons"],
    queryFn: fetchLessonsLight,
  });

  return {
    data: query.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
