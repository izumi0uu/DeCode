import { StrapiAttribute, StrapiRelationship } from "./commons";
import { CourseAttributes } from "./course";

/**
 * 分类属性
 */
export interface CategoryAttributes extends StrapiAttribute {
  name: string;
  slug: string;
  description: string;
  courses: StrapiRelationship<CourseAttributes>;
}

/**
 * 分类类型
 */
export interface Category {
  id: number;
  attributes: CategoryAttributes;
}
