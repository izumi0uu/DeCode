// src/types/api/tokenomics-config.ts
import { StrapiListResponse, StrapiResponse } from "./common";

/**
 * 代币经济配置基础属性
 */
export interface TokenomicsConfig {
  id: number;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  baseRewardAmount: number; // 基础奖励金额
  courseCompletionMultiplier: number; // 课程完成奖励倍数
  quizPassMultiplier: number; // 测验通过奖励倍数
  perfectScoreBonus: number; // 满分奖励
  dailyLearningBonus: number; // 每日学习奖励
  weeklyStreak: number; // 每周连续学习奖励
  referralBonus: number; // 推荐奖励
  contributionReward: number; // 内容贡献奖励
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建代币经济配置的输入类型
 */
export type TokenomicsConfigInput = Omit<
  TokenomicsConfig,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * 更新代币经济配置的输入类型
 */
export type TokenomicsConfigUpdateInput = Partial<TokenomicsConfigInput>;

/**
 * 代币经济配置响应类型
 */
export type TokenomicsConfigResponse = StrapiResponse<TokenomicsConfig>;

/**
 * 代币经济配置列表响应类型
 */
export type TokenomicsConfigListResponse = StrapiListResponse<TokenomicsConfig>;
