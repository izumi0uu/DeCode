import { StrapiAttribute, StrapiRelationship } from "./commons";
import { UserAttributes } from "./user";
import { ThematicResponseAttributes } from "./thematic-response";
import { CourseAttributes } from "./course";
import { LessonAttributes } from "./lesson";

/**
 * 主题查询状态
 */
export type ThematicQueryStatus = "pending" | "answered" | "closed";

/**
 * 主题查询属性
 */
export interface ThematicQueryAttributes extends StrapiAttribute {
  title: string;
  content: string;
  status: ThematicQueryStatus;
  user: StrapiRelationship<UserAttributes>;
  responses: StrapiRelationship<ThematicResponseAttributes>;
  course: StrapiRelationship<CourseAttributes> | null;
  lesson: StrapiRelationship<LessonAttributes> | null;
}

/**
 * 主题查询类型
 */
export interface ThematicQuery {
  id: number;
  attributes: ThematicQueryAttributes;
}

/**
 * 主题查询列表响应
 */
export interface ThematicQueryListResponse {
  data: ThematicQuery[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
