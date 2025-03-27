// src/types/api/sbt-certification.ts
import { Relation, StrapiListResponse, StrapiResponse } from "./common";
import { Course } from "./course";

/**
 * SBT 认证状态枚举
 */
export enum SbtCertificationStatus {
  PENDING = "pending",
  MINTING = "minting",
  MINTED = "minted",
  FAILED = "failed",
}

/**
 * SBT 认证基础属性
 */
export interface SbtCertification {
  id: number;
  user: number; // 用户ID
  course: Relation<Course>;
  walletAddress: string;
  transactionHash: string | null;
  ipfsHash: string | null;
  tokenId: number | null;
  tokenUri: string | null;
  metadataJson: string; // JSON 字符串，包含证书元数据
  status: SbtCertificationStatus;
  mintedAt: string | null;
  completionDate: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建 SBT 认证的输入类型
 */
export type SbtCertificationInput = Omit<
  SbtCertification,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * 更新 SBT 认证的输入类型
 */
export type SbtCertificationUpdateInput = Partial<SbtCertificationInput>;

/**
 * SBT 认证响应类型
 */
export type SbtCertificationResponse = StrapiResponse<SbtCertification>;

/**
 * SBT 认证列表响应类型
 */
export type SbtCertificationListResponse = StrapiListResponse<SbtCertification>;
