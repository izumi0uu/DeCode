import { StrapiAttribute, StrapiRelationship } from "./commons";
import { CourseAttributes } from "./course";

/**
 * 学习路径配置属性
 */
export interface LearningPathConfigAttributes extends StrapiAttribute {
  title: string;
  description: string;
  isDefault: boolean;
  courses: StrapiRelationship<CourseAttributes>;
}

/**
 * 学习路径配置类型
 */
export interface LearningPathConfig {
  id: number;
  attributes: LearningPathConfigAttributes;
}

/**
 * 学习路径配置列表响应
 */
export interface LearningPathConfigListResponse {
  data: LearningPathConfig[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
