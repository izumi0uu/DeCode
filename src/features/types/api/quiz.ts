// src/types/api/quiz.ts
import {
  Relation,
  RelationArray,
  StrapiListResponse,
  StrapiResponse,
} from "./common";
import { Lesson } from "./lesson";
import { QuizQuestion } from "./quiz-question";

/**
 * AI提示模板类型
 */
export interface AIPromptTemplate {
  id: number;
  content: string;
  scoreRubric: {
    functionality: number;
    security: number;
    bestPractices: number;
  };
  codeAnalysis: {
    checkSecurity: boolean;
    checkGas: boolean;
    checkBestPractices: boolean;
  };
}

/**
 * 测验基础属性
 */
export interface Quiz {
  id: number;
  title: string;
  description: string;
  passingScore: number; // 通过分数
  timeLimit: number | null; // 时间限制（分钟）
  shuffleQuestions?: boolean; // 是否打乱问题顺序
  documentId?: string; // 从schema中看到的documentId字段
  lesson: Relation<Lesson>;
  questions: RelationArray<QuizQuestion>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  slug: string;
  aiPromptTemplate?: AIPromptTemplate; // AI提示模板作为可选属性
}

/**
 * 创建测验的输入类型
 */
export type QuizInput = Omit<
  Quiz,
  "id" | "createdAt" | "updatedAt" | "publishedAt"
>;

/**
 * 更新测验的输入类型
 */
export type QuizUpdateInput = Partial<QuizInput>;

/**
 * 测验响应类型
 */
export type QuizResponse = StrapiResponse<Quiz>;

/**
 * 测验列表响应类型
 */
export type QuizListResponse = StrapiListResponse<Quiz>;
