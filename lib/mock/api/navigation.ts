import { CourseDetail, LessonDetail } from "@/types";
import { mockCourses } from "../data/courses";
import { mockLessons } from "../data/lessons";
import { transformNavigation } from "../../strapi/services/navigationService";
import { simulateCall } from "../index";

export async function fetchNavigation(options?: {
  withProgress?: boolean; // 是否包含进度信息
  lang?: "zh" | "en"; // 语言过滤
}) {
  // 模拟网络延迟 300ms
  await simulateCall(300);

  try {
    // 1. 获取课程数据
    let courses = [...mockCourses];
    let lessons = [...mockLessons];

    // 2. 根据语言筛选
    if (options?.lang) {
      courses = courses.filter((course) => course.lang === options.lang);
      lessons = lessons.filter((lesson) => lesson.lang === options.lang);
    }

    // 3. 如果不需要进度信息，移除相关字段
    if (!options?.withProgress) {
      courses = courses.map((course) => ({
        ...course,
        progress: 0,
      })) as CourseDetail[];

      lessons = lessons.map((lesson) => ({
        ...lesson,
        progress: 0,
      })) as LessonDetail[];
    }

    // 4. 使用 transformNavigation 转换数据
    const navigationData = transformNavigation(
      courses,
      lessons,
      [], // 不包含测验数据
      options?.withProgress ? mockUserProgress : undefined
    );

    return {
      success: true,
      data: navigationData,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: "Failed to fetch navigation data",
    };
  }
}

// 模拟用户进度数据
const mockUserProgress = {
  courses: {
    1: { progress: 60 },
  },
  lessons: {
    1: { progress: 100 },
    2: { progress: 50 },
  },
};
