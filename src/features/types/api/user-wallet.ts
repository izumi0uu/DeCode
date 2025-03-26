import { StrapiAttribute, StrapiRelationship } from './commons';
import { UserAttributes } from './user';
import { SbtCertificationAttributes } from './sbt-certification';

/**
 * 用户钱包属性
 */
export interface UserWalletAttributes extends StrapiAttribute {
  address: string;
  network: string;
  isVerified: boolean;
  verifiedAt: string | null;
  user: StrapiRelationship<UserAttributes>;
  tokenRewards: StrapiRelationship<TokenRewardAttributes>;
  sbtCertifications: StrapiRelationship<SbtCertificationAttributes>;
}

/**
 * 用户钱包类型
 */
export interface UserWallet {
  id: number;
  attributes: UserWalletAttributes;
}

/**
 * 用户钱包列表响应
 */
export interface UserWalletListResponse {
  data: UserWallet[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}