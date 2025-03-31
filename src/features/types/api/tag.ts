// src/types/api/tag.ts
import { RelationArray, StrapiListResponse, StrapiResponse } from "./common";
import { Course } from "./course";

/**
 * 标签基础属性
 */
export interface Tag {
  id: number;
  name: string;
  slug: string;
  shortDescription?: string;
  courses: RelationArray<Course>;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建标签的输入类型
 */
export type TagInput = Omit<Tag, "id" | "createdAt" | "updatedAt">;

/**
 * 更新标签的输入类型
 */
export type TagUpdateInput = Partial<TagInput>;

/**
 * 标签响应类型
 */
export type TagResponse = StrapiResponse<Tag>;

/**
 * 标签列表响应类型
 */
export type TagListResponse = StrapiListResponse<Tag>;
