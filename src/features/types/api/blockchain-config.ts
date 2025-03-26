import { StrapiAttribute } from "./commons";

/**
 * 区块链配置属性
 */
export interface BlockchainConfigAttributes extends StrapiAttribute {
  network: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  tokenSymbol: string;
  tokenDecimals: number;
  tokenContractAddress: string;
  sbtContractAddress: string;
  isMainnet: boolean;
}

/**
 * 区块链配置类型
 */
export interface BlockchainConfig {
  id: number;
  attributes: BlockchainConfigAttributes;
}

/**
 * 区块链配置响应
 */
export interface BlockchainConfigResponse {
  data: BlockchainConfig;
  meta: {};
}
