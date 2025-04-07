// src/types/api/quiz-answer.ts
import {
  Relation,
  RelationArray,
  StrapiListResponse,
  StrapiResponse,
} from "./common";
import { Quiz } from "./quiz";
import { QuizQuestion } from "./quiz-question";
import { QuizOption } from "./quiz-option";
import { UserQuizProgress } from "./user-quiz-progress";

/**
 * 测验答案基础属性
 */
export interface QuizAnswer {
  id: number;
  selectedOptions?: any; // JSON类型，存储选择的选项
  isCorrect: boolean;
  codeSubmission?: string; // 代码提交，用于编程题
  quizProgress: Relation<UserQuizProgress>;
  question: Relation<QuizQuestion>;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

/**
 * 创建测验答案的输入类型
 */
export type QuizAnswerInput = Omit<
  QuizAnswer,
  "id" | "createdAt" | "updatedAt" | "publishedAt"
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
