import { Course, CourseAttributes } from "../api/course";
import { Lesson, LessonAttributes } from "../api/lesson";
import { Quiz } from "../api/quiz";
import { UserQuizProgress } from "../api/user-quiz-progress";

type NavNodeType = "course" | "lesson" | "quiz";

// 基础导航节点
interface NavNodeBase {
  id: string;
  type: NavNodeType;
  path: string;
  title: string;
  sortOrder: number;
  parent?: string;
  children?: NavNode[];
}

// 课程导航节点
interface CourseNavNode extends NavNodeBase {
  type: "course";
  metadata: {
    courseId: number;
    difficulty: CourseAttributes["difficulty"];
    progress: number;
    learners: number;
    studyTime: number;
    status: string;
    lang: string;
  };
}

// 课程章节导航节点
interface LessonNavNode extends NavNodeBase {
  type: "lesson";
  metadata: {
    courseId: number;
    lessonId: number;
    progress: number;
    studyTime: number;
    status: string;
    lang: string;
  };
}

// 测验导航节点
interface QuizNavNode extends NavNodeBase {
  type: "quiz";
  metadata: {
    courseId: number;
    lessonId: number;
    requiredScore: number;
    retryLimit: number;
    // 用户测验状态
    attempt?: {
      score: number;
      passed: boolean;
      startTime: string;
      endTime: string;
    };
    // SBT 奖励信息
    sbtReward?: {
      enabled: boolean;
      contractAddress?: string;
    };
  };
}

type NavNode = CourseNavNode | LessonNavNode | QuizNavNode;

export type { NavNode, NavNodeType, CourseNavNode, LessonNavNode, QuizNavNode };
