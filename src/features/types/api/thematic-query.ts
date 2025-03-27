// src/types/api/thematic-query.ts
import { Relation, StrapiListResponse, StrapiResponse } from "./common";
import { Course } from "./course";
import { Lesson } from "./lesson";

/**
 * 查询状态枚举
 */
export enum QueryStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

/**
 * 主题查询基础属性
 */
export interface ThematicQuery {
  id: number;
  user: number; // 用户ID
  query: string; // 用户的查询文本
  context: string; // 上下文信息
  course: Relation<Course>;
  lesson: Relation<Lesson>;
  status: QueryStatus;
  metadata: {
    browserInfo?: string;
    ipAddress?: string;
    sessionId?: string;
    additionalContext?: Record<string, any>;
  };
  processingStartedAt: string | null;
  processingCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建主题查询的输入类型
 */
export type ThematicQueryInput = Omit<
  ThematicQuery,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * 更新主题查询的输入类型
 */
export type ThematicQueryUpdateInput = Partial<ThematicQueryInput>;

/**
 * 主题查询响应类型
 */
export type ThematicQueryResponse = StrapiResponse<ThematicQuery>;

/**
 * 主题查询列表响应类型
 */
export type ThematicQueryListResponse = StrapiListResponse<ThematicQuery>;
