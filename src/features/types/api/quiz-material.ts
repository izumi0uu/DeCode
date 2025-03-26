import { StrapiAttribute, StrapiRelationship, StrapiMedia } from "./commons";
import { QuizAttributes } from "./quiz";

/**
 * 测验材料属性
 */
export interface QuizMaterialAttributes extends StrapiAttribute {
  title: string;
  description: string;
  content: any; // 富文本内容
  files: StrapiMedia[];
  quiz: StrapiRelationship<QuizAttributes>;
}

/**
 * 测验材料类型
 */
export interface QuizMaterial {
  id: number;
  attributes: QuizMaterialAttributes;
}

/**
 * 测验材料列表响应
 */
export interface QuizMaterialListResponse {
  data: QuizMaterial[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
