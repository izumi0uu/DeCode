// src/types/api/quiz-material.ts
import { Media, Relation, StrapiListResponse, StrapiResponse } from "./common";
import { Quiz } from "./quiz";

/**
 * 测验材料类型枚举
 */
export enum QuizMaterialType {
  TEXT = "text",
  IMAGE = "image",
  CODE = "code",
  DIAGRAM = "diagram",
}

/**
 * 测验材料基础属性
 */
export interface QuizMaterial {
  id: number;
  title: string;
  description: string;
  type: QuizMaterialType;
  content: string;
  image: Relation<Media>;
  quiz: Relation<Quiz>;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建测验材料的输入类型
 */
export type QuizMaterialInput = Omit<
  QuizMaterial,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * 更新测验材料的输入类型
 */
export type QuizMaterialUpdateInput = Partial<QuizMaterialInput>;

/**
 * 测验材料响应类型
 */
export type QuizMaterialResponse = StrapiResponse<QuizMaterial>;

/**
 * 测验材料列表响应类型
 */
export type QuizMaterialListResponse = StrapiListResponse<QuizMaterial>;
