import { StrapiAttribute, StrapiRelationship } from "./commons";
import { QuizQuestionAttributes } from "./quiz-question";
import { UserQuizProgressAttributes } from "./user-quiz-progress";

/**
/**
 * 测验答案属性
 */
export interface QuizAnswerAttributes extends StrapiAttribute {
  selectedOptions: number[]; // 选择的选项ID
  userAnswer: string | null; // 用户填空题答案
  isCorrect: boolean;
  question: StrapiRelationship<QuizQuestionAttributes>;
  userQuizProgress: StrapiRelationship<UserQuizProgressAttributes>;
}

/**
 * 测验答案类型
 */
export interface QuizAnswer {
  id: number;
  attributes: QuizAnswerAttributes;
}

/**
 * 测验答案列表响应
 */
export interface QuizAnswerListResponse {
  data: QuizAnswer[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
