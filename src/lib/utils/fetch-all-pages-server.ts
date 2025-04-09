// src/lib/utils/serverFetchUtils.ts
import { cache } from "react";
import qs from "qs";

interface PaginationMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * 服务端专用 - 获取API的所有分页数据
 * @param apiEndpoint API端点路径，例如 "/api/lessons"
 * @param baseQueryParams 基础查询参数
 * @param pageSize 每页数据量，默认100
 * @returns 合并后的完整数据集
 */
export const fetchAllPagesServer = cache(async function <T>(
  apiEndpoint: string,
  baseQueryParams: Record<string, any> = {},
  pageSize = 100,
  cacheTags: string[] = []
): Promise<PaginatedResponse<T>> {
  // 确保使用完整URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const fullEndpoint = apiEndpoint.startsWith("http")
    ? apiEndpoint
    : `${baseUrl}${apiEndpoint}`;

  // 构建查询参数
  const queryParams = {
    ...baseQueryParams,
    pagination: {
      ...(baseQueryParams.pagination || {}),
      pageSize,
    },
  };

  // 获取第一页数据
  const firstPageQuery = qs.stringify(queryParams, { encodeValuesOnly: true });
  const firstResponse = await fetch(`${fullEndpoint}?${firstPageQuery}`, {
    next: {
      tags: [...cacheTags, "pagination"],
      revalidate: 3600,
    },
  });

  if (!firstResponse.ok) {
    throw new Error(`Failed to fetch data from ${apiEndpoint}`);
  }

  const firstPageData = (await firstResponse.json()) as PaginatedResponse<T>;
  const pagination = firstPageData.meta.pagination;
  const pageCount = pagination?.pageCount || 1;

  // 如果只有一页数据，直接返回
  if (pageCount <= 1) {
    return firstPageData;
  }

  // 获取剩余页面的数据
  const remainingPagePromises: Promise<PaginatedResponse<T>>[] = [];

  for (let page = 2; page <= pageCount; page++) {
    const pageQueryParams = {
      ...queryParams,
      pagination: {
        ...queryParams.pagination,
        page,
      },
    };

    const pageQuery = qs.stringify(pageQueryParams, { encodeValuesOnly: true });
    const pagePromise = fetch(`${fullEndpoint}?${pageQuery}`, {
      next: {
        tags: [...cacheTags, `page-${page}`, "pagination"],
        revalidate: 3600,
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch page ${page} from ${apiEndpoint}`);
      }
      return response.json() as Promise<PaginatedResponse<T>>;
    });

    remainingPagePromises.push(pagePromise);
  }

  // 等待所有页面数据加载完成
  const remainingPagesData = await Promise.all(remainingPagePromises);

  // 合并所有页面数据
  const allData: PaginatedResponse<T> = {
    data: [
      ...firstPageData.data,
      ...remainingPagesData.flatMap((page) => page.data),
    ],
    meta: firstPageData.meta, // 保留原始元数据
  };

  return allData;
});
