// src/types/api/token-reward.ts
import { Relation, StrapiListResponse, StrapiResponse } from "./common";
import { Course } from "./course";
import { Quiz } from "./quiz";

/**
 * 奖励类型枚举
 */
export enum RewardType {
  COURSE_COMPLETION = "course_completion",
  QUIZ_COMPLETION = "quiz_completion",
  DAILY_LOGIN = "daily_login",
  REFERRAL = "referral",
  CONTRIBUTION = "contribution",
  MANUAL = "manual",
}

/**
 * 奖励状态枚举
 */
export enum RewardStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

/**
 * 代币奖励基础属性
 */
export interface TokenReward {
  id: number;
  user: number; // 用户ID
  walletAddress: string;
  amount: number;
  type: RewardType;
  description: string;
  transactionHash: string | null;
  course: Relation<Course>;
  quiz: Relation<Quiz>;
  status: RewardStatus;
  rewardedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建代币奖励的输入类型
 */
export type TokenRewardInput = Omit<
  TokenReward,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * 更新代币奖励的输入类型
 */
export type TokenRewardUpdateInput = Partial<TokenRewardInput>;

/**
 * 代币奖励响应类型
 */
export type TokenRewardResponse = StrapiResponse<TokenReward>;

/**
 * 代币奖励列表响应类型
 */
export type TokenRewardListResponse = StrapiListResponse<TokenReward>;
