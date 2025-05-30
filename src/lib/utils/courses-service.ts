import {
  NavNode,
  CourseDetail,
  LessonDetail,
  QuizMeta,
} from "@/features/types";

function transformIntoCourseTree(
  courses: CourseDetail[], // 所有课程数据
  lessons: LessonDetail[], // 所有章节数据
  quizzes: QuizMeta[], // 所有测验数据
  userProgress?: any // 用户学习进度
): NavNode[] {
  // 1.首先将章节按照课程ID分组，方便后续查找
  const lessonsByCourseId: Record<number, LessonDetail[]> = lessons?.reduce(
    (acc, lesson) => {
      if (!acc[lesson.course_id]) acc[lesson.course_id] = [];
      acc[lesson.course_id].push(lesson);
      return acc;
    },
    {} as Record<number, LessonDetail[]>
  );

  // 2. 遍历所有课程，生成课程节点
  return courses?.map((course) => ({
    // 课程基本信息
    id: `course-${course.id}`,
    type: "course",
    title: course.title,
    path: `/courses/${course.slug || course.id}`,
    sortOrder: course.sortOrder || 0,
    metadata: {
      courseId: course.id,
      courseTitle: course.title,
      progress: userProgress?.courses?.[course.id]?.progress || 0,
      learners: course.learners || 0,
      studyTime: course.duration || 0,
      status: course.status || (course.published ? "published" : "draft"),
      difficulty: mapDifficulty(course.difficulty),
      lang: course.locale || "en",
    },

    // 3. 转换该课程的所有章节
    children: (lessonsByCourseId[course.id] || [])
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map((lesson) => ({
        id: `lesson-${lesson.id}`,
        type: "lesson",
        title: lesson.title,
        path: `/courses/${course.slug || course.id}/lessons/${
          lesson.slug || lesson.id
        }`,
        sortOrder: lesson.sortOrder || 0,
        metadata: {
          courseId: course.id,
          lessonId: lesson.id,
          progress: userProgress?.lessons?.[lesson.id]?.progress || 0,
          studyTime: lesson.duration || 0,
          status: lesson.status || (lesson.publishedAt ? "published" : "draft"),
          lang: lesson.locale || course.locale || "en",
        },
      })),
  }));
}

function mapDifficulty(
  difficulty: string
): "Beginner" | "Intermediate" | "Advanced" {
  const map: Record<string, "Beginner" | "Intermediate" | "Advanced"> = {
    easy: "Beginner",
    medium: "Intermediate",
    hard: "Advanced",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };
  return map[difficulty] || "Beginner";
}

export { transformIntoCourseTree };
