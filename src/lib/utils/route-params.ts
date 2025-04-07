import React from "react";

/**
 * 解析 Next.js 15+ 路由参数，处理可能是 Promise 的情况
 * @param params 路由参数对象
 * @returns 解析后的路由参数对象
 */
export function useRouteParams<T extends Record<string, any>>(params: T): T {
  // 检查 params 是否可能是 Promise-like 对象
  if (
    params &&
    typeof params === "object" &&
    typeof (params as any).then === "function"
  ) {
    // 使用 unknown 作为中间转换类型，避免直接转换错误
    return React.use(params as unknown as Promise<T>);
  }
  // 不是 Promise，直接返回
  return params;
}
