import { StrapiAttribute, StrapiRelationship, StrapiMedia } from "./commons";
import { LessonAttributes } from "./lesson";

/**
 * 资源类型
 */
export type ResourceType = "document" | "link" | "image" | "code" | "video";

/**
 * 资源属性
 */
export interface ResourceAttributes extends StrapiAttribute {
  title: string;
  description: string;
  type: ResourceType;
  url: string;
  file: StrapiMedia;
  lesson: StrapiRelationship<LessonAttributes>;
}

/**
 * 资源类型
 */
export interface Resource {
  id: number;
  attributes: ResourceAttributes;
}

/**
 * 资源列表响应
 */
export interface ResourceListResponse {
  data: Resource[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
