// src/types/api/blockchain-config.ts
import { StrapiListResponse, StrapiResponse } from "./common";

/**
 * 网络类型枚举
 */
export enum BlockchainNetwork {
  ETHEREUM = "ethereum",
  POLYGON = "polygon",
  BSC = "binance_smart_chain",
  ARBITRUM = "arbitrum",
  OPTIMISM = "optimism",
  BASE = "base",
}

/**
 * 区块链配置基础属性
 */
export interface BlockchainConfig {
  id: number;
  name: string;
  description: string;
  network: BlockchainNetwork;
  chainId: number;
  rpcUrl: string;
  blockExplorerUrl: string;
  nativeCurrencyName: string;
  nativeCurrencySymbol: string;
  nativeCurrencyDecimals: number;
  contractAddresses: {
    sbtCertification?: string;
    tokenReward?: string;
  };
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建区块链配置的输入类型
 */
export type BlockchainConfigInput = Omit<
  BlockchainConfig,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * 更新区块链配置的输入类型
 */
export type BlockchainConfigUpdateInput = Partial<BlockchainConfigInput>;

/**
 * 区块链配置响应类型
 */
export type BlockchainConfigResponse = StrapiResponse<BlockchainConfig>;

/**
 * 区块链配置列表响应类型
 */
export type BlockchainConfigListResponse = StrapiListResponse<BlockchainConfig>;
