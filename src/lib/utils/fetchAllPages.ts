/**
 * 用于获取所有分页数据的工具函数
 * 该函数会自动处理分页逻辑，获取所有页面的数据，并将它们合并返回
 */

// @ts-ignore - qs模块类型声明问题
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
 * 获取API的所有分页数据
 * @param apiEndpoint API端点路径，例如 "/api/lessons"
 * @param baseQueryParams 基础查询参数
 * @param pageSize 每页数据量，默认100
 * @returns 合并后的完整数据集
 */
export async function fetchAllPages<T>(
  apiEndpoint: string,
  baseQueryParams: Record<string, any> = {},
  pageSize = 100
): Promise<PaginatedResponse<T>> {
  // 构建基础查询参数，添加分页设置
  const queryParams = {
    ...baseQueryParams,
    pagination: {
      ...(baseQueryParams.pagination || {}),
      pageSize,
    },
  };

  // 获取第一页数据
  const firstPageQuery = qs.stringify(queryParams, { encodeValuesOnly: true });
  const firstResponse = await fetch(`${apiEndpoint}?${firstPageQuery}`);

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
    const pagePromise = fetch(`${apiEndpoint}?${pageQuery}`).then(
      (response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch page ${page} from ${apiEndpoint}`);
        }
        return response.json() as Promise<PaginatedResponse<T>>;
      }
    );

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
}
