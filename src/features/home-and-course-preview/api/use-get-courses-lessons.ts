// src/features/home-and-course-preview/api/use-get-courses-lessons.ts
import { useQuery } from "@tanstack/react-query";
import { transformIntoCourseTree } from "@/lib/utils/coursesService";
import { NavNode } from "@/features/types/navigation";
import { mode } from "@/resources/config";

// 根据 Strapi 课程模型定义响应类型
interface CourseResponse {
  data: {
    id: number;
    attributes: {
      slug: string;
      title: string;
      description: string;
      level: string;
      duration: number;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      locale: string;
      published: boolean;
      isPopular: boolean;
      difficulty: string;
      sbtEnabled: boolean;
      sbtContractAddress: string | null;
    };
  }[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// 根据 Strapi 章节模型定义响应类型
interface LessonResponse {
  data: {
    id: number;
    attributes: {
      slug: string;
      title: string;
      description: string;
      content: any;
      videoUrl: string;
      isPreview: boolean;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      locale: string;
      course: {
        data: {
          id: number;
        };
      };
    };
  }[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// 获取课程数据
const fetchCourses = async () => {
  const response = await fetch("/api/courses");
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  return response.json() as Promise<CourseResponse>;
};

// 获取章节数据
const fetchLessons = async () => {
  const response = await fetch("/api/lessons");
  if (!response.ok) {
    throw new Error("Failed to fetch lessons");
  }
  return response.json() as Promise<LessonResponse>;
};

// 转换数据为导航树结构
const transformData = (
  courses: CourseResponse,
  lessons: LessonResponse
): {
  success: boolean;
  data: NavNode[];
  error: null | string;
} => {
  try {
    // 转换课程数据为所需格式
    const courseData = courses.data.map((course) => ({
      id: course.id,
      title: course.attributes.title,
      description: course.attributes.description,
      status: course.attributes.published ? "published" : "draft",
      difficulty: course.attributes.difficulty,
      study_time: course.attributes.duration,
      learners: 0, // 默认值，实际应从API获取
      lang: course.attributes.locale,
      progress: 0, // 默认值，实际应从用户进度API获取
    }));

    // 转换章节数据为所需格式
    const lessonData = lessons.data.map((lesson) => ({
      id: lesson.id,
      title: lesson.attributes.title,
      description: lesson.attributes.description,
      sort: 0, // 需要在 Strapi 模型中添加 sort 字段，或者使用其他字段代替
      status: lesson.attributes.publishedAt ? "published" : "draft",
      study_time: 0, // 需要在 Strapi 模型中添加 study_time 字段
      course_id: lesson.attributes.course.data.id,
      lang: lesson.attributes.locale,
    }));

    // 使用现有的 transformIntoCourseTree 函数生成导航树
    const courseTree = transformIntoCourseTree(
      courseData,
      lessonData,
      [], // 不包含测验数据
      mode.cascaderMode.withProgress ? mockUserProgress : undefined
    );

    return { success: true, data: courseTree, error: null };
  } catch (error) {
    console.error("Error transforming data:", error);
    return { success: false, data: [], error: "Failed to transform data" };
  }
};

// 模拟用户进度数据，实际应从用户进度API获取
const mockUserProgress = {
  courses: {
    1: { progress: 60 },
  },
  lessons: {
    1: { progress: 100 },
    2: { progress: 50 },
  },
};

// 自定义 hook，获取课程和章节数据并转换为导航树
export const useCoursesAndLessons = () => {
  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const lessonsQuery = useQuery({
    queryKey: ["lessons"],
    queryFn: fetchLessons,
    enabled: !!coursesQuery.data, // 只有在课程数据加载完成后才加载章节数据
  });

  // 当两个查询都完成时，转换数据
  const isLoading = coursesQuery.isLoading || lessonsQuery.isLoading;
  const isError = coursesQuery.isError || lessonsQuery.isError;
  const error = coursesQuery.error || lessonsQuery.error;

  let navigationData: NavNode[] = [];
  let success = false;

  if (coursesQuery.data && lessonsQuery.data) {
    const result = transformData(coursesQuery.data, lessonsQuery.data);
    navigationData = result.data;
    success = result.success;
  }

  return {
    isLoading,
    isError,
    error,
    data: navigationData,
    success,
  };
};

// 为了向后兼容，保留原有的 useCourses 函数
export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => fetchCourses(),
  });
};

// 导出获取章节的 hook
export const useLessons = () => {
  return useQuery({
    queryKey: ["lessons"],
    queryFn: () => fetchLessons(),
  });
};
