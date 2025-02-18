import { CourseDetail, CoursePreview } from "./course";
import { Lesson, LessonDetail } from "./lesson";
import { QuizMeta, QuizAttempt } from "./quiz";

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

// 课程导航节点 - 使用 CourseDetail 类型
interface CourseNavNode extends NavNodeBase {
  type: "course";
  metadata: {
    courseId: CourseDetail["id"];
    difficulty: CourseDetail["difficulty"];
    progress: number;
    learners: CourseDetail["learners"];
    studyTime: CourseDetail["study_time"];
    status: CourseDetail["status"];
    lang: CourseDetail["lang"];
  };
}

// 课程章节导航节点 - 使用 LessonDetail 类型
interface LessonNavNode extends NavNodeBase {
  type: "lesson";
  metadata: {
    courseId: Lesson["course_id"];
    lessonId: Lesson["id"];
    progress: LessonDetail["progress"];
    studyTime: Lesson["study_time"];
    status: Lesson["status"];
    lang: Lesson["lang"];
  };
}

// 测验导航节点 - 使用 QuizMeta 和 QuizAttempt 类型
interface QuizNavNode extends NavNodeBase {
  type: "quiz";
  metadata: {
    courseId: QuizMeta["course_id"];
    lessonId: QuizMeta["lesson_id"];
    requiredScore: QuizMeta["required_score"];
    retryLimit: QuizMeta["retry_limit"];
    // 从 QuizAttempt 获取用户测验状态
    attempt?: {
      score: QuizAttempt["score"];
      passed: QuizAttempt["passed"];
      startTime: QuizAttempt["start_time"];
      endTime: QuizAttempt["end_time"];
    };
    // SBT 奖励信息
    sbtReward?: QuizMeta["sbt_reward"];
  };
}

type NavNode = CourseNavNode | LessonNavNode | QuizNavNode;

export type { NavNode, NavNodeType, CourseNavNode, LessonNavNode, QuizNavNode };
