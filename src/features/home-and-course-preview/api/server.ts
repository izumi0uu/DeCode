// src/features/home-and-course-preview/api/server.ts
import { cache } from "react";
import qs from "qs";
import { Course, LessonLight } from "@/features/types";
import { fetchAllPagesServer } from "@/lib/utils/fetch-all-pages-server";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// 获取课程数据
const fetchCourses = cache(async () => {
  const queryParams = { populate: ["tags"] };

  const queryString = qs.stringify(queryParams, { encodeValuesOnly: true });
  const url = `${baseUrl}/api/courses?${queryString}`;

  const response = await fetch(url, {
    next: { tags: ["courses"], revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }

  return response.json();
});

// 获取轻量级课时数据，使用服务端专用分页函数
const fetchLessonsLight = cache(async () => {
  const queryParams = {
    populate: {
      course: {
        populate: ["tags"],
      },
      quizzes: true,
      tags: true,
      coverImage: true,
    },
  };

  // 使用服务端专用分页函数
  return fetchAllPagesServer<LessonLight>(
    "/api/lessons",
    queryParams,
    100, // pageSize
    ["lessons"] // cacheTags
  );
});

// 组合课程和课时数据
const getCoursesAndLessonsForPreview = cache(async () => {
  const [coursesResponse, lessonsResponse] = await Promise.all([
    fetchCourses(),
    fetchLessonsLight(),
  ]);

  const courses = coursesResponse.data;
  const lessons = lessonsResponse.data;

  // 将课时按课程分组
  const lessonsByCourse = lessons.reduce(
    (acc: Record<number, LessonLight[]>, lesson: LessonLight) => {
      const courseId = lesson.course?.id;
      if (courseId) {
        if (!acc[courseId]) {
          acc[courseId] = [];
        }
        acc[courseId].push(lesson);
      }
      return acc;
    },
    {} as Record<number, LessonLight[]>
  );

  // 为每个课程添加其关联的课时
  const coursesWithLessons = courses.map((course: Course) => {
    return {
      ...course,
      lessons: lessonsByCourse[course.id] || [],
    };
  });

  return {
    courses,
    lessons,
    coursesWithLessons,
  };
});

// 获取热门课程
const getPopularCourses = cache(async () => {
  const queryParams = {
    sort: ["popularity:desc"],
    populate: ["coverImage", "tags"],
    pagination: {
      limit: 10,
    },
  };

  const queryString = qs.stringify(queryParams, { encodeValuesOnly: true });
  const url = `${baseUrl}/api/courses?${queryString}`;

  const response = await fetch(url, {
    next: { tags: ["popular-courses"], revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch popular courses");
  }

  const result = await response.json();
  return result.data;
});

export {
  getCoursesAndLessonsForPreview, // 获取用于预览卡片的课程和章节数据
  getPopularCourses, // 获取热门课程
};
