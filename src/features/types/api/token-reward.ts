import { StrapiAttribute, StrapiRelationship } from "./commons";
import { UserAttributes } from "./user";
import { UserWalletAttributes } from "./user-wallet";
import { CourseAttributes } from "./course";
import { QuizAttributes } from "./quiz";

/**
 * 代币奖励状态
 */
export type TokenRewardStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

/**
 * 代币奖励类型
 */
export type TokenRewardType =
  | "course_completion"
  | "quiz_completion"
  | "community_contribution";

/**
 * 代币奖励属性
 */
export interface TokenRewardAttributes extends StrapiAttribute {
  amount: number;
  type: TokenRewardType;
  status: TokenRewardStatus;
  transactionHash: string | null;
  processedAt: string | null;
  user: StrapiRelationship<UserAttributes>;
  userWallet: StrapiRelationship<UserWalletAttributes>;
  course: StrapiRelationship<CourseAttributes> | null;
  quiz: StrapiRelationship<QuizAttributes> | null;
}

/**
 * 代币奖励类型
 */
export interface TokenReward {
  id: number;
  attributes: TokenRewardAttributes;
}

/**
 * 代币奖励列表响应
 */
export interface TokenRewardListResponse {
  data: TokenReward[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
