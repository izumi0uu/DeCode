import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
// @ts-ignore
import qs from "qs";
import { NavNode } from "@/features/types";
import type {
  CourseListResponse,
  LessonLight,
  Course,
  ApiDataResponse,
  HookResponse,
} from "@/features/types";
import {
  LESSON_LIGHT_FIELDS,
  COURSE_LIGHT_FIELDS,
  QUIZ_LIGHT_FIELDS,
} from "@/features/types";
import { fetchAllPages } from "@/lib/utils/fetch-all-pages";

// 获取课程数据
const fetchCourses = async (): Promise<ApiDataResponse<Course[]>> => {
  try {
    // 使用Strapi v5 qs格式
    const queryString = qs.stringify({
      populate: ["tags"],
    });

    const response = await fetch(`/api/courses?${queryString}`);
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
          populate: ["tags"],
        },
        quizzes: {
          fields: QUIZ_LIGHT_FIELDS,
        },
        tags: true, // 使用tags: true简化查询,
        coverImage: true,
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
          status: "published",
          lang: course.locale || "en",
        },
      }));

      // 返回课程节点，包含章节子节点
      return {
        id: courseId.toString(),
        title: course.title,
        path: `/courses/${course.slug}`,
        type: "course",
        children: lessonNodes.length > 0 ? lessonNodes : undefined,
        sortOrder: 0,
        metadata: {
          courseId: courseId,
          difficulty: course.difficulty || "beginner",
          progress: 0, // 默认值
          learners: 0, // 默认值
          studyTime: course.duration || 0,
          status: "published",
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
const useCoursesAndLessonsToNavTree = (): HookResponse<NavNode[]> => {
  const coursesQuery = useSuspenseQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const lessonsQuery = useSuspenseQuery({
    queryKey: ["lessons-light"],
    queryFn: fetchLessonsLight,
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
const useCoursesAndLessonsForPreview =
  (): HookResponse<CoursesAndLessonsPreview> => {
    const query = useSuspenseQuery({
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

const useCourses = (): HookResponse<Course[]> => {
  const query = useSuspenseQuery({
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

const useLessons = (): HookResponse<LessonLight[]> => {
  const query = useSuspenseQuery({
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

export {
  useCoursesAndLessonsToNavTree, // 转换数据为导航树
  useCoursesAndLessonsForPreview, // 获取用于预览卡片的课程和章节数据
  useCourses, // 获取课程数据
  useLessons, // 获取章节数据
};
