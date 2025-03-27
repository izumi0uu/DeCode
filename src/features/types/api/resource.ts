// src/types/api/resource.ts
import { Media, Relation, StrapiListResponse, StrapiResponse } from "./common";

/**
 * 资源类型枚举
 */
export enum ResourceType {
  DOCUMENT = "document",
  VIDEO = "video",
  LINK = "link",
  CODE = "code",
  GITHUB = "github",
}

/**
 * 资源基础属性
 */
export interface Resource {
  id: number;
  title: string;
  description: string;
  type: ResourceType;
  url: string;
  file: Relation<Media>;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建资源的输入类型
 */
export type ResourceInput = Omit<
  Resource,
  "id" | "createdAt" | "updatedAt" | "publishedAt"
>;

/**
 * 更新资源的输入类型
 */
export type ResourceUpdateInput = Partial<ResourceInput>;

/**
 * 资源响应类型
 */
export type ResourceResponse = StrapiResponse<Resource>;

/**
 * 资源列表响应类型
 */
export type ResourceListResponse = StrapiListResponse<Resource>;
