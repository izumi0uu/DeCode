import { StrapiAttribute, StrapiRelationship } from "./commons";
import { CourseAttributes } from "./course";

/**
 * 标签属性
 */
export interface TagAttributes extends StrapiAttribute {
  name: string;
  slug: string;
  courses: StrapiRelationship<CourseAttributes>;
}

/**
 * 标签类型
 */
export interface Tag {
  id: number;
  attributes: TagAttributes;
}
