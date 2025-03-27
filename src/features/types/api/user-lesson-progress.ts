// src/types/api/user-lesson-progress.ts
import { Relation, StrapiListResponse, StrapiResponse } from "./common";
import { Lesson } from "./lesson";

/**
 * 用户章节进度状态枚举
 */
export enum LessonProgressStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

/**
 * 用户章节进度基础属性
 */
export interface UserLessonProgress {
  id: number;
  user: number; // 用户ID
  lesson: Relation<Lesson>;
  status: LessonProgressStatus;
  progress: number; // 进度百分比 (0-100)
  currentPosition: number; // 当前视频位置（秒）
  startedAt: string | null;
  completedAt: string | null;
  lastAccessedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建用户章节进度的输入类型
 */
export type UserLessonProgressInput = Omit<
  UserLessonProgress,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * 更新用户章节进度的输入类型
 */
export type UserLessonProgressUpdateInput = Partial<UserLessonProgressInput>;

/**
 * 用户章节进度响应类型
 */
export type UserLessonProgressResponse = StrapiResponse<UserLessonProgress>;

/**
 * 用户章节进度列表响应类型
 */
export type UserLessonProgressListResponse =
  StrapiListResponse<UserLessonProgress>;
