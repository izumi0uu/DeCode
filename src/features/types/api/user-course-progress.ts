import { StrapiAttribute, StrapiRelationship, StrapiMedia } from "./commons";
import { UserAttributes } from "./user";
import { CourseAttributes } from "./course";
import { UserLessonProgressAttributes } from "./user-lesson-progress";
import { UserQuizProgressAttributes } from "./user-quiz-progress";

/**
 * 用户课程进度状态
 */
export type CourseProgressStatus = "not_started" | "in_progress" | "completed";

/**
 * 用户课程进度属性
 */
export interface UserCourseProgressAttributes extends StrapiAttribute {
  status: CourseProgressStatus;
  progress: number; // 百分比 0-100
  startedAt: string | null;
  completedAt: string | null;
  lastAccessedAt: string | null;
  timeSpent: number; // 秒数
  certificate: StrapiMedia;
  user: StrapiRelationship<UserAttributes>;
  course: StrapiRelationship<CourseAttributes>;
  lessonProgresses: StrapiRelationship<UserLessonProgressAttributes>;
  quizProgresses: StrapiRelationship<UserQuizProgressAttributes>;
}

/**
 * 用户课程进度类型
 */
export interface UserCourseProgress {
  id: number;
  attributes: UserCourseProgressAttributes;
}

/**
 * 用户课程进度列表响应
 */
export interface UserCourseProgressListResponse {
  data: UserCourseProgress[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
