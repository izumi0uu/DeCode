import { StrapiAttribute, StrapiRelationship } from "./commons";
import { UserAttributes } from "./user";
import { QuizAttributes } from "./quiz";
import { QuizAnswerAttributes } from "./quiz-answer";
import { UserCourseProgressAttributes } from "./user-course-progress";

/**
 * 用户测验进度状态
 */
export type QuizProgressStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "failed";

/**
 * 用户测验进度属性
 */
export interface UserQuizProgressAttributes extends StrapiAttribute {
  status: QuizProgressStatus;
  score: number;
  startedAt: string | null;
  completedAt: string | null;
  timeSpent: number; // 秒数
  attemptsCount: number;
  user: StrapiRelationship<UserAttributes>;
  quiz: StrapiRelationship<QuizAttributes>;
  answers: StrapiRelationship<QuizAnswerAttributes>;
  userCourseProgress: StrapiRelationship<UserCourseProgressAttributes>;
}

/**
 * 用户测验进度类型
 */
export interface UserQuizProgress {
  id: number;
  attributes: UserQuizProgressAttributes;
}

/**
 * 用户测验进度列表响应
 */
export interface UserQuizProgressListResponse {
  data: UserQuizProgress[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
