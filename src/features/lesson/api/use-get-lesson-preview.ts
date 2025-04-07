import type { Course, LessonLight, HookResponse } from "@/features/types";

// 课程和章节预览数据接口
export interface CoursesAndLessonsPreview {
  courses: Course[];
  lessons: LessonLight[];
  coursesWithLessons: Array<Course & { lessons: LessonLight[] }>;
}

// 使用来自home-and-course-preview的hook
import { useCoursesAndLessonsForPreview as baseUseCoursesAndLessonsForPreview } from "@/features/home-and-course-preview/api/use-get-courses-lessons";

// 当前课程及其章节相关信息
export interface CurrentLessonContext {
  currentCourse: Course | undefined;
  currentLesson: LessonLight | undefined;
  prevLesson: LessonLight | undefined;
  nextLesson: LessonLight | undefined;
  courseLessons: LessonLight[];
}

// 重导出hook
export const useCoursesAndLessonsForPreview =
  baseUseCoursesAndLessonsForPreview;

// 获取当前课程和章节的数据
export const useCurrentLesson = (
  coursename: string,
  lessonname: string
): HookResponse<CurrentLessonContext> => {
  const {
    data: coursesData,
    isLoading,
    isError,
    error,
  } = useCoursesAndLessonsForPreview();

  let result: CurrentLessonContext = {
    currentCourse: undefined,
    currentLesson: undefined,
    prevLesson: undefined,
    nextLesson: undefined,
    courseLessons: [],
  };

  if (coursesData && !isLoading && !isError) {
    // 查找当前课程
    const currentCourse = coursesData.courses.find(
      (c) => c.slug === coursename || c.id.toString() === coursename
    );

    // 查找当前课程的所有章节并排序
    const courseLessons = currentCourse
      ? coursesData.lessons
          .filter((l) => l.course?.id === currentCourse.id)
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      : [];

    // 查找当前章节
    const currentLesson = currentCourse
      ? coursesData.lessons.find(
          (l) =>
            (l.slug === lessonname || l.id.toString() === lessonname) &&
            l.course?.id === currentCourse.id
        )
      : undefined;

    // 查找前一个和后一个章节
    let prevLesson, nextLesson;

    if (currentLesson) {
      const currentIndex = courseLessons.findIndex(
        (l) => l.id === currentLesson.id
      );
      prevLesson =
        currentIndex > 0 ? courseLessons[currentIndex - 1] : undefined;
      nextLesson =
        currentIndex >= 0 && currentIndex < courseLessons.length - 1
          ? courseLessons[currentIndex + 1]
          : undefined;
    }

    result = {
      currentCourse,
      currentLesson,
      prevLesson,
      nextLesson,
      courseLessons,
    };
  }

  return {
    data: result,
    isLoading,
    isError,
    error,
  };
};
