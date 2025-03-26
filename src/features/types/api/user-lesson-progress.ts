import { StrapiAttribute, StrapiRelationship } from "./commons";
import { UserAttributes } from "./user";
import { LessonAttributes } from "./lesson";
import { UserCourseProgressAttributes } from "./user-course-progress";

/**
 * 用户章节进度状态
 */
export type LessonProgressStatus = "not_started" | "in_progress" | "completed";

/**
 * 用户章节进度属性
 */
export interface UserLessonProgressAttributes extends StrapiAttribute {
  status: LessonProgressStatus;
  progress: number; // 百分比 0-100
  lastPosition: number; // 上次学习位置（视频时间点或滚动位置）
  startedAt: string | null;
  completedAt: string | null;
  timeSpent: number; // 秒数
  user: StrapiRelationship<UserAttributes>;
  lesson: StrapiRelationship<LessonAttributes>;
  userCourseProgress: StrapiRelationship<UserCourseProgressAttributes>;
}

/**
 * 用户章节进度类型
 */
export interface UserLessonProgress {
  id: number;
  attributes: UserLessonProgressAttributes;
}

/**
 * 用户章节进度列表响应
 */
export interface UserLessonProgressListResponse {
  data: UserLessonProgress[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
