import { StrapiAttribute, StrapiRelationship } from "./commons";
import { QuizQuestionAttributes } from "./quiz-question";

/**
 * 测验选项属性
 */
export interface QuizOptionAttributes extends StrapiAttribute {
  text: string;
  isCorrect: boolean;
  explanation: string | null;
  question: StrapiRelationship<QuizQuestionAttributes>;
}

/**
 * 测验选项类型
 */
export interface QuizOption {
  id: number;
  attributes: QuizOptionAttributes;
}

/**
 * 测验选项列表响应
 */
export interface QuizOptionListResponse {
  data: QuizOption[];
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
 * 单个测验选项响应
 */
export interface QuizOptionResponse {
  data: QuizOption;
  meta: {};
}
