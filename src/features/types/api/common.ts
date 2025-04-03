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
 * Strapi v5 扁平化响应格式
 */
export interface StrapiResponse<T> {
  data: T;
  meta: Meta;
}

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
 * 自定义 API 钩子返回类型
 * 用于统一处理 React Query 的返回结果
 */
export interface HookResponse<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

/**
 * API 函数返回类型
 * 用于统一各种 fetch 函数的返回格式
 */
export interface ApiDataResponse<T> {
  data: T;
  meta: {
    isLoading: boolean;
    isError: boolean;
    error: unknown | null;
  };
}

/**
 * 通用媒体格式
 */
export interface MediaFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: null | string;
  size: number;
  width: number;
  height: number;
  sizeInBytes?: number;
}

/**
 * 通用媒体对象
 */
export interface Media {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  formats?: Record<string, MediaFormat>;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string | null;
  provider: string;
  provider_metadata?: any | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

/**
 * 通用图片对象
 */
export interface MediaImage extends Media {
  width: number;
  height: number;
  formats: {
    small: MediaFormat;
    thumbnail: MediaFormat;
    [key: string]: MediaFormat;
  };
}

/**
 * 通用 Relation 类型 (Strapi v5 扁平化)
 */
export type Relation<T> = T;
export type RelationArray<T> = T[];
