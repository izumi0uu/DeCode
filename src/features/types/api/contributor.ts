import { StrapiAttribute, StrapiRelationship, StrapiMedia } from "./commons";
import { CourseAttributes } from "./course";

/**
 * 贡献者角色
 */
export type ContributorRole = "author" | "editor" | "reviewer" | "translator";

/**
 * 贡献者属性
 */
export interface ContributorAttributes extends StrapiAttribute {
  name: string;
  bio: string;
  avatar: StrapiMedia;
  role: ContributorRole;
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  courses: StrapiRelationship<CourseAttributes>;
}

/**
 * 贡献者类型
 */
export interface Contributor {
  id: number;
  attributes: ContributorAttributes;
}

/**
 * 贡献者列表响应
 */
export interface ContributorListResponse {
  data: Contributor[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
