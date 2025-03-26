import { StrapiAttribute, StrapiRelationship } from "./commons";
import { LessonAttributes } from "./lesson";
import { QuizQuestionAttributes } from "./quiz-question";

/**LessonAttributes,
 * 测验属性
 */
export interface QuizAttributes extends StrapiAttribute {
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  lesson: StrapiRelationship<LessonAttributes>;
  questions: StrapiRelationship<QuizQuestionAttributes>;
}

export interface QuizListResponse {
  data: Quiz[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface QuizResponse {
  data: Quiz;
  meta: {};
}

/**
 * 测验类型
 */
export interface Quiz {
  id: number;
  attributes: QuizAttributes;
}
