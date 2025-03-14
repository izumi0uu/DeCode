// 用户进度类型定义
interface CourseProgress {
  progress: number; // 课程总进度（0-100）
  lastAccessed: string; // 最后访问时间
  completed?: boolean; // 是否完成
  startedAt?: string; // 开始学习时间
  completedAt?: string; // 完成时间
}

interface LessonProgress {
  progress: number; // 章节进度（0-100）
  lastAccessed: string; // 最后访问时间
  completed?: boolean; // 是否完成
  startedAt?: string; // 开始学习时间
  completedAt?: string; // 完成时间
  timeSpent?: number; // 学习时长（分钟）
}

interface QuizProgress {
  attempts: number; // 尝试次数
  highestScore: number; // 最高分数
  lastAttempt: string; // 最后尝试时间
  passed?: boolean; // 是否通过
  attemptsLeft?: number; // 剩余尝试次数
  lastScore?: number; // 最近一次分数
}

interface UserProgress {
  courses: {
    [courseId: number]: CourseProgress;
  };
  lessons: {
    [lessonId: number]: LessonProgress;
  };
  quizzes: {
    [quizId: string]: QuizProgress;
  };

  statistics?: {
    totalCourses: number;
    completedCourses: number;
    totalLessons: number;
    completedLessons: number;
    totalQuizzes: number;
    passedQuizzes: number;
    totalTimeSpent: number;
    averageScore: number;
  };
}

export type { UserProgress };
