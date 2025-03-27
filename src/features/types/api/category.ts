// src/types/api/category.ts
import { RelationArray, StrapiListResponse, StrapiResponse } from "./common";
import { Course } from "./course";
import { Media, Relation } from "./common";

/**
 * 分类基础属性
 */
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: Relation<Media>;
  order: number;
  courses: RelationArray<Course>;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建分类的输入类型
 */
export type CategoryInput = Omit<Category, "id" | "createdAt" | "updatedAt">;

/**
 * 更新分类的输入类型
 */
export type CategoryUpdateInput = Partial<CategoryInput>;

/**
 * 分类响应类型
 */
export type CategoryResponse = StrapiResponse<Category>;

/**
 * 分类列表响应类型
 */
export type CategoryListResponse = StrapiListResponse<Category>;
