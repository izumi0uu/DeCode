// src/types/api/user-wallet.ts
import { StrapiListResponse, StrapiResponse } from "./common";

/**
 * 钱包类型枚举
 */
export enum WalletType {
  METAMASK = "metamask",
  COINBASE = "coinbase",
  WALLETCONNECT = "walletconnect",
  PHANTOM = "phantom",
  OTHER = "other",
}

/**
 * 用户钱包基础属性
 */
export interface UserWallet {
  id: number;
  user: number; // 用户ID
  address: string;
  walletType: WalletType;
  chainId: number;
  isDefault: boolean;
  nonce: string; // 用于签名认证
  lastSignedAt: string | null;
  tokenBalance: number | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建用户钱包的输入类型
 */
export type UserWalletInput = Omit<
  UserWallet,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * 更新用户钱包的输入类型
 */
export type UserWalletUpdateInput = Partial<UserWalletInput>;

/**
 * 用户钱包响应类型
 */
export type UserWalletResponse = StrapiResponse<UserWallet>;

/**
 * 用户钱包列表响应类型
 */
export type UserWalletListResponse = StrapiListResponse<UserWallet>;
