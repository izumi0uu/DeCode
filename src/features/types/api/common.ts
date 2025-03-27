// src/types/api/common.ts

/**
 * Strapi 通用响应元数据
 */
export interface Meta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

/**
 * Strapi 单项响应格式
 */
export interface StrapiResponse<T> {
  data: T;
  meta: Meta;
}

/**
 * Strapi 列表响应格式
 */
export interface StrapiListResponse<T> {
  data: T[];
  meta: Meta;
}

/**
 * Strapi 错误响应
 */
export interface StrapiError {
  status: number;
  name: string;
  message: string;
  details?: Record<string, any>;
}

/**
 * 通用媒体格式
 */
export interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width?: number;
  height?: number;
  size: number;
  url: string;
}

/**
 * 通用媒体对象
 */
export interface Media {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: Record<string, MediaFormat>;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 通用 Relation 类型
 */
export type Relation<T> = { data: T | null };
export type RelationArray<T> = { data: T[] };
