// src/features/home-and-course-preview/api/use-get-courses-lessons.ts
import { useQuery } from "@tanstack/react-query";
import {
  CourseResponse,
  LessonAttributes,
  LessonResponse,
  NavNode,
} from "@/features/types";
import type { CourseListResponse, LessonListResponse } from "@/features/types";

// 获取课程数据
const fetchCourses = async () => {
  const response = await fetch("/api/courses");
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  return response.json() as Promise<CourseListResponse>;
};

// 获取章节数据
const fetchLessons = async () => {
  const response = await fetch("/api/lessons");
  if (!response.ok) {
    throw new Error("Failed to fetch lessons");
  }
  return response.json() as Promise<LessonListResponse>;
};

// 转换数据为导航树结构
const transformData = (
  courses: CourseListResponse,
  lessons: LessonListResponse
): NavNode[] => {
  try {
    // 创建课程导航节点
    const courseNodes: NavNode[] = courses.data.map((course) => {
      // 查找属于当前课程的所有章节
      const courseId = course.id;
      const courseLessons = lessons.data.filter(
        (lesson) => lesson.course?.id === courseId // 修改这里的访问路径
      );

      // 为每个章节创建子节点
      const lessonNodes: NavNode[] = courseLessons.map((lesson) => ({
        id: lesson.id.toString(),
        title: lesson.title, // 直接访问属性
        path: `/courses/${course.slug}/${lesson.slug}`, // 直接访问slug
        type: "lesson",
        metadata: {}, // 添加必要属性
        sortOrder: lesson.position || 0, // 添加必要属性
      }));

      // 返回课程节点，包含章节子节点
      return {
        id: courseId.toString(),
        title: course.title, // 直接访问属性
        path: `/courses/${course.title.toLowerCase().replace(/\s+/g, "-")}`,
        type: "course",
        children: lessonNodes.length > 0 ? lessonNodes : undefined,
        metadata: {}, // 添加必要属性
        sortOrder: 0, // 添加必要属性
      };
    });

    return courseNodes;
  } catch (error) {
    console.error("Error transforming data:", error);
    return [];
  }
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

  let data: NavNode[] = [];

  if (coursesQuery.data && lessonsQuery.data) {
    data = transformData(coursesQuery.data, lessonsQuery.data);
  }

  return {
    isLoading,
    isError,
    error,
    data,
  };
};

export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => fetchCourses(),
  });
};

export const useLessons = () => {
  return useQuery({
    queryKey: ["lessons"],
    queryFn: () => fetchLessons(),
  });
};
