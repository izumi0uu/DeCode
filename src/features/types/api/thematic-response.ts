import { Relation, StrapiListResponse, StrapiResponse } from "./common";
import { ThematicQuery } from "./thematic-query";

/**
 * 响应来源枚举
 */
export enum ResponseSource {
  AI = "ai",
  TUTOR = "tutor",
  SYSTEM = "system",
}

/**
 * 主题响应基础属性
 */
export interface ThematicResponse {
  id: number;
  query: Relation<ThematicQuery>;
  response: string; // 响应文本
  source: ResponseSource;
  responseMetadata: {
    modelName?: string;
    tokensUsed?: number;
    processingTime?: number;
    confidenceScore?: number;
    additionalInfo?: Record<string, any>;
  };
  feedback: {
    helpful: boolean;
    feedbackText?: string;
    ratingScore?: number;
  } | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建主题响应的输入类型
 */
export type ThematicResponseInput = Omit<
  ThematicResponse,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * 更新主题响应的输入类型
 */
export type ThematicResponseUpdateInput = Partial<ThematicResponseInput>;

/**
 * 主题响应响应类型
 */
export type ThematicResponseResponse = StrapiResponse<ThematicResponse>;

/**
 * 主题响应列表响应类型
 */
export type ThematicResponseListResponse = StrapiListResponse<ThematicResponse>;
