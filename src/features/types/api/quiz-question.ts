// src/types/api/quiz-question.ts
import {
  Relation,
  RelationArray,
  StrapiListResponse,
  StrapiResponse,
} from "./common";
import { Quiz } from "./quiz";
import { QuizOption } from "./quiz-option";

/**
 * 问题类型枚举
 */
export enum QuestionType {
  SINGLE_CHOICE = "single",
  MULTIPLE_CHOICE = "multiple",
  TRUE_FALSE = "true_false",
  SHORT_ANSWER = "short_answer",
  PROGRAMMING = "programming",
}

/**
 * 测验问题基础属性
 */
export interface QuizQuestion {
  id: number;
  question: string;
  type: QuestionType;
  points: number;
  sortOrder?: number;
  codeTemplate?: string | null;
  quiz: Relation<Quiz>;
  options: RelationArray<QuizOption>;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

/**
 * 创建测验问题的输入类型
 */
export type QuizQuestionInput = Omit<
  QuizQuestion,
  "id" | "createdAt" | "updatedAt" | "publishedAt"
>;

/**
 * 更新测验问题的输入类型
 */
export type QuizQuestionUpdateInput = Partial<QuizQuestionInput>;

/**
 * 测验问题响应类型
 */
export type QuizQuestionResponse = StrapiResponse<QuizQuestion>;

/**
 * 测验问题列表响应类型
 */
export type QuizQuestionListResponse = StrapiListResponse<QuizQuestion>;
