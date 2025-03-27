// src/types/api/user-quiz-progress.ts
import { Relation, StrapiListResponse, StrapiResponse } from "./common";
import { Quiz } from "./quiz";

/**
 * 用户测验进度状态枚举
 */
export enum QuizProgressStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  FAILED = "failed",
  PASSED = "passed",
}

/**
 * 用户测验进度基础属性
 */
export interface UserQuizProgress {
  id: number;
  user: number; // 用户ID
  quiz: Relation<Quiz>;
  status: QuizProgressStatus;
  score: number; // 得分
  maxScore: number; // 最高可能分数
  answers: {
    questionId: number;
    selectedOptions: number[];
    isCorrect: boolean;
    points: number;
  }[];
  attempts: number; // 尝试次数
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建用户测验进度的输入类型
 */
export type UserQuizProgressInput = Omit<
  UserQuizProgress,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * 更新用户测验进度的输入类型
 */
export type UserQuizProgressUpdateInput = Partial<UserQuizProgressInput>;

/**
 * 用户测验进度响应类型
 */
export type UserQuizProgressResponse = StrapiResponse<UserQuizProgress>;

/**
 * 用户测验进度列表响应类型
 */
export type UserQuizProgressListResponse = StrapiListResponse<UserQuizProgress>;
