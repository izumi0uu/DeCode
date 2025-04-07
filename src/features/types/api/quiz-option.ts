// src/types/api/quiz-option.ts
import { Relation, StrapiListResponse, StrapiResponse } from "./common";
import { QuizQuestion } from "./quiz-question";

/**
 * 测验选项基础属性
 */
export interface QuizOption {
  id: number;
  text: string;
  isCorrect: boolean;
  explanation?: any; // 在schema中是blocks类型
  question: Relation<QuizQuestion>;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

/**
 * 创建测验选项的输入类型
 */
export type QuizOptionInput = Omit<
  QuizOption,
  "id" | "createdAt" | "updatedAt" | "publishedAt"
>;

/**
 * 更新测验选项的输入类型
 */
export type QuizOptionUpdateInput = Partial<QuizOptionInput>;

/**
 * 测验选项响应类型
 */
export type QuizOptionResponse = StrapiResponse<QuizOption>;

/**
 * 测验选项列表响应类型
 */
export type QuizOptionListResponse = StrapiListResponse<QuizOption>;
