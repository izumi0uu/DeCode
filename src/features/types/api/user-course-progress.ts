// src/types/api/user-course-progress.ts
import { Relation, StrapiListResponse, StrapiResponse } from "./common";
import { Course } from "./course";

/**
 * 用户课程进度状态枚举
 */
export enum CourseProgressStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

/**
 * 用户课程进度基础属性
 */
export interface UserCourseProgress {
  id: number;
  user: number; // 用户ID
  course: Relation<Course>;
  status: CourseProgressStatus;
  progress: number; // 进度百分比 (0-100)
  startedAt: string | null;
  completedAt: string | null;
  lastAccessedAt: string | null;
  certificateIssued: boolean;
  certificateUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建用户课程进度的输入类型
 */
export type UserCourseProgressInput = Omit<
  UserCourseProgress,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * 更新用户课程进度的输入类型
 */
export type UserCourseProgressUpdateInput = Partial<UserCourseProgressInput>;

/**
 * 用户课程进度响应类型
 */
export type UserCourseProgressResponse = StrapiResponse<UserCourseProgress>;

/**
 * 用户课程进度列表响应类型
 */
export type UserCourseProgressListResponse =
  StrapiListResponse<UserCourseProgress>;
