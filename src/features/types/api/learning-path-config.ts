// src/types/api/learning-path-config.ts
import {
  Media,
  Relation,
  RelationArray,
  StrapiListResponse,
  StrapiResponse,
} from "./common";
import { Course } from "./course";

/**
 * 学习路径配置基础属性
 */
export interface LearningPathConfig {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverImage: Relation<Media>;
  courses: RelationArray<Course>;
  estimatedHours: number;
  difficulty: string;
  prerequisites: string;
  outcomes: string;
  isActive: boolean;
  isDefault: boolean;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建学习路径配置的输入类型
 */
export type LearningPathConfigInput = Omit<
  LearningPathConfig,
  "id" | "createdAt" | "updatedAt" | "publishedAt"
>;

/**
 * 更新学习路径配置的输入类型
 */
export type LearningPathConfigUpdateInput = Partial<LearningPathConfigInput>;

/**
 * 学习路径配置响应类型
 */
export type LearningPathConfigResponse = StrapiResponse<LearningPathConfig>;

/**
 * 学习路径配置列表响应类型
 */
export type LearningPathConfigListResponse =
  StrapiListResponse<LearningPathConfig>;
