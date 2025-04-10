/**
 * 生成稳定ID工具函数
 * 用于生成在服务器端和客户端保持一致的稳定ID
 * 解决因为Math.random()生成随机ID导致的水合错误
 */

import { useId } from "react";

/**
 * 生成稳定的元素ID，适用于Radio、Checkbox等组件
 * @param prefix 前缀，如'radio'或'checkbox'
 * @param name 元素名称/分组名称
 * @param value 元素值
 * @param index 元素索引(如果没有值)
 * @returns 稳定的ID字符串
 */
export function generateStableId(
  prefix: string,
  name: string,
  value?: string | number,
  index?: number
): string {
  // 使用元素类型、名称和值/索引生成确定性ID
  return `${prefix}-${name}-${value !== undefined ? value : index || 0}`;
}

/**
 * React Hook，返回一个稳定ID生成函数
 * 适用于无法直接使用useId()的地方
 */
export function useStableId() {
  const idPrefix = useId();

  return {
    /**
     * 生成一个稳定ID
     * @param prefix 前缀，如'radio'或'checkbox'
     * @param name 元素名称/分组名称
     * @param value 元素值(可选)
     * @returns 稳定的ID字符串
     */
    generate: (
      prefix: string,
      name: string,
      value?: string | number
    ): string => {
      return `${idPrefix}-${prefix}-${name}-${
        value !== undefined ? value : ""
      }`;
    },
  };
}

/**
 * 使用固定盐值创建稳定哈希
 * 适用于需要短ID且无法使用React hooks的场景
 * @param input 输入字符串
 * @returns 稳定的哈希字符串
 */
export function createStableHash(input: string): string {
  // 简单哈希函数，生成稳定结果
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 转换为32位整数
  }
  return Math.abs(hash).toString(36).substring(0, 8);
}
