import { StrapiAttribute, StrapiRelationship } from "./commons";

/**
 * SBT认证状态
 */
export type SbtCertificationStatus = "pending" | "minted" | "failed";

/**
 * SBT认证属性
 */
export interface SbtCertificationAttributes extends StrapiAttribute {
  tokenId: string;
  transactionHash: string;
  status: SbtCertificationStatus;
  mintedAt: string | null;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
  user: StrapiRelationship<UserAttributes>;
  course: StrapiRelationship<CourseAttributes>;
  userCourseProgress: StrapiRelationship<UserCourseProgressAttributes>;
}

/**
 * SBT认证类型
 */
export interface SbtCertification {
  id: number;
  attributes: SbtCertificationAttributes;
}

/**
 * SBT认证列表响应
 */
export interface SbtCertificationListResponse {
  data: SbtCertification[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
