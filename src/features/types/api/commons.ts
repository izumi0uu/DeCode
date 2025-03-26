/**
 * 通用API响应格式
 */
export interface PaginationMeta {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  }
  
  export interface ApiResponse<T> {
    data: T;
    meta: {
      pagination: PaginationMeta;
    };
  }
  
  export interface ApiError {
    status: number;
    name: string;
    message: string;
    details?: Record<string, any>;
  }
  
  /**
   * Strapi数据结构类型
   */
  export interface StrapiAttribute {
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    locale?: string;
  }
  
  export interface StrapiData<T> {
    id: number;
    attributes: T;
  }
  
  export interface StrapiRelationship<T> {
    data: StrapiData<T> | StrapiData<T>[] | null;
  }
  
  export interface StrapiMedia {
    data: {
      id: number;
      attributes: {
        name: string;
        alternativeText: string | null;
        caption: string | null;
        width: number;
        height: number;
        formats: Record<string, any>;
        hash: string;
        ext: string;
        mime: string;
        size: number;
        url: string;
        previewUrl: string | null;
        provider: string;
        createdAt: string;
        updatedAt: string;
      };
    } | null;
  }