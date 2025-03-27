// src/types/api/quiz-answer.ts
import { Relation, StrapiListResponse, StrapiResponse } from "./common";
import { Quiz } from "./quiz";
import { QuizQuestion } from "./quiz-question";
import { QuizOption } from "./quiz-option";

/**
 * 测验答案基础属性
 */
export interface QuizAnswer {
  id: number;
  user: number; // 用户ID
  quiz: Relation<Quiz>;
  question: Relation<QuizQuestion>;
  selectedOptions: RelationArray<QuizOption>;
  textAnswer: string | null; // 用于简答题
  isCorrect: boolean;
  points: number;
  timeTaken: number | null; // 回答问题所花费的时间（秒）
  attemptNumber: number; // 尝试次数
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建测验答案的输入类型
 */
export type QuizAnswerInput = Omit<
  QuizAnswer,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * 更新测验答案的输入类型
 */
export type QuizAnswerUpdateInput = Partial<QuizAnswerInput>;

/**
 * 测验答案响应类型
 */
export type QuizAnswerResponse = StrapiResponse<QuizAnswer>;

/**
 * 测验答案列表响应类型
 */
export type QuizAnswerListResponse = StrapiListResponse<QuizAnswer>;
