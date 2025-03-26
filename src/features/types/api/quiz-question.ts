import { StrapiAttribute, StrapiRelationship } from "./commons";
import { QuizAttributes } from "./quiz";
import { QuizOptionAttributes } from "./quiz-option";
/**
 * 测验题目类型
 */
export type QuizQuestionType =
  | "single_choice"
  | "multiple_choice"
  | "true_false"
  | "fill_blank";

/**
 * 测验题目属性
 */
export interface QuizQuestionAttributes extends StrapiAttribute {
  question: string;
  type: QuizQuestionType;
  points: number;
  explanation: string | null;
  quiz: StrapiRelationship<QuizAttributes>;
  options: StrapiRelationship<QuizOptionAttributes>;
}

/**
 * 测验题目类型
 */
export interface QuizQuestion {
  id: number;
  attributes: QuizQuestionAttributes;
}

/**
 * 测验题目列表响应
 */
export interface QuizQuestionListResponse {
  data: QuizQuestion[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * 单个测验题目响应
 */
export interface QuizQuestionResponse {
  data: QuizQuestion;
  meta: {};
}
