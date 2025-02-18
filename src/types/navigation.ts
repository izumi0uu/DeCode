import { CoursePreview, CourseDetail, Lesson, LessonDetail } from "@/types";

type NavNodeType = "course" | "lesson" | "quiz";

interface NavNodeBase {
  id: string;
  type: NavNodeType;
  path: string; // 路径
  title: string;
  sortOrder: number;
  parent?: string; // 父节点ID
  children?: NavNode[]; // 子节点
  metadata?: {
    courseId?: number;
    difficulty?: string;
    completion?: number; //学习进度
    hasQuiz?: boolean;
  };
}

// 课程导航节点
interface CourseNavNode extends NavNodeBase {
  type: "course";
  metadata: {
    courseId: CoursePreview["id"];
    difficulty: CoursePreview["difficulty"];
    progress: number;
    learners: number;
    studyTime: number;
  };
}

// 课程章节导航节点
interface LessonNavNode extends NavNodeBase {
  type: "lesson";
  metadata: {
    courseId: Lesson["course_id"];
    lessonId: Lesson["id"];
    progress: number;
    studyTime: Lesson["study_time"];
  };
}

interface QuizNavNode extends NavNodeBase {
  type: "quiz";
  metadata: {
    courseId: number;
    lessonId: number;
    hasAttempted: boolean;
    highestScore?: number;
  };
}

type NavNode = CourseNavNode | LessonNavNode | QuizNavNode;

export type { NavNode, NavNodeType, CourseNavNode, LessonNavNode, QuizNavNode };
