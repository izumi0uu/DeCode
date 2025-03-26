import { StrapiAttribute } from "./commons";

/**
 * 代币经济学配置属性
 */
export interface TokenomicsConfigAttributes extends StrapiAttribute {
  courseCompletionReward: number;
  quizPassingReward: number;
  contributionBaseReward: number;
  dailyRewardCap: number;
  isEnabled: boolean;
}

/**
 * 代币经济学配置类型
 */
export interface TokenomicsConfig {
  id: number;
  attributes: TokenomicsConfigAttributes;
}

/**
 * 代币经济学配置响应
 */
export interface TokenomicsConfigResponse {
  data: TokenomicsConfig;
  meta: {};
}
