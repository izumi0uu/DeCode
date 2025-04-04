// src/features/types/api/hook-responses.ts
import { ApiDataResponse, HookResponse } from "./common";

/**
 * 导出前端钩子使用的响应类型
 * 这些类型专门用于React组件与数据钩子(hooks)之间的交互
 */

export type { ApiDataResponse, HookResponse };

// 这个接口定义针对分页钩子响应
export interface PaginatedHookResponse<T> extends HookResponse<T> {
  pagination?: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// 可以根据需要添加更多特定于钩子的复合类型
