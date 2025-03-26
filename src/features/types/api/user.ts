import { StrapiAttribute, StrapiRelationship, StrapiMedia } from "./commons";
import {
  UserCourseProgressAttributes,
  UserLessonProgressAttributes,
  UserQuizProgressAttributes,
} from "./user-quiz-progress";

/**
 * 用户属性
 */
export interface UserAttributes extends StrapiAttribute {
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  role: StrapiRelationship<RoleAttributes>;
  profile: {
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    avatar: StrapiMedia;
  };
  coursesProgress: StrapiRelationship<UserCourseProgressAttributes>;
  lessonsProgress: StrapiRelationship<UserLessonProgressAttributes>;
  quizzesProgress: StrapiRelationship<UserQuizProgressAttributes>;
  certificates: StrapiRelationship<SbtCertificationAttributes>;
  tokenRewards: StrapiRelationship<TokenRewardAttributes>;
}

/**
 * 用户类型
 */
export interface User {
  id: number;
  attributes: UserAttributes;
}

/**
 * 用户钱包属性
 */
export interface UserWalletAttributes extends StrapiAttribute {
  user: StrapiRelationship<UserAttributes>;
  address: string;
  isVerified: boolean;
  verifiedAt: string | null;
  network: BlockchainNetwork;
}

/**
 * 用户钱包类型
 */
export interface UserWallet {
  id: number;
  attributes: UserWalletAttributes;
}
