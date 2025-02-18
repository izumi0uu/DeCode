interface BaseUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  created_at: string;
  updated_at: string;
  role: "admin" | "user";
}

interface OnChainIdentity {
  sbtCertifications: {
    courseId: number;
    tokenId: string;
    contractAddress: string;
    earnedAt: string;
  }[];
  codeSubmissions: {
    unitId: number;
    ipfsHash: string;
    txHash: string;
  }[];
  reputationScore: number; // 基于学习行为的链上信誉分
}

// 学习进度跟踪
interface LearningProgress {
  completedUnits: number[];
  currentProgress: {
    unitId: number;
    quizAttempts: number;
    highestScore: number;
  }[];
  timeSpent: Record<number, number>; // unitId -> 分钟数
}

interface User extends BaseUser, OnChainIdentity, LearningProgress {
  socialAccounts: {
    github?: string;
    discord?: string;
    twitter?: string;
  };
  preferences: {
    darkMode: boolean;
    notification: {
      courseUpdate: boolean;
      sbtExpiration: boolean;
    };
  };
}

interface AuthResponse {
  user: Omit<User, "walletAddress">;
  nonce: string; // 钱包登录用的随机数
  accessToken: string;
}

interface WalletLoginParams {
  signature: string;
  message: string;
  publicAddress: string;
}

export type { User, AuthResponse, WalletLoginParams };
