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
  SINGLE_CHOICE = "single_choice",
  MULTIPLE_CHOICE = "multiple_choice",
  TRUE_FALSE = "true_false",
  SHORT_ANSWER = "short_answer",
}

/**
 * 测验问题基础属性
 */
export interface QuizQuestion {
  id: number;
  question: string;
  type: QuestionType;
  points: number;
  explanation: string | null; // 问题解释（回答后显示）
  position: number; // 问题顺序
  quiz: Relation<Quiz>;
  options: RelationArray<QuizOption>;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

/**
 * 创建测验问题的输入类型
 */
export type QuizQuestionInput = Omit<
  QuizQuestion,
  "id" | "createdAt" | "updatedAt"
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
