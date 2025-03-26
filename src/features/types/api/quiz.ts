import { StrapiAttribute, StrapiRelationship } from "./commons";
import { LessonAttributes } from "./lesson";
import { QuizQuestionAttributes } from "./quiz-question";

/**
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

/**
 * 测验类型
 */
export interface Quiz {
  id: number;
  attributes: QuizAttributes;
}
