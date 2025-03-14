import { UserProgress } from "./userProgress";

interface BaseUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  created_at: string;
  updated_at: string;
  role: "admin" | "user";
}

//链上身份和认证
interface OnChainIdentity {
  // SBT 证书认证
  sbtCertifications: {
    courseId: number;
    tokenId: string;
    contractAddress: string;
    earnedAt: string;
    expiresAt?: string;
    metadata?: {
      score: number;
      level: string;
      skills: string[];
    };
  }[];
  codeSubmissions: {
    unitId: number;
    ipfsHash: string;
    txHash: string;
    submittedAt: string;
    language: "solidity" | "react";
    score?: number;
    feedback?: string;
  }[];

  reputationScore: number; // 基于学习行为的链上信誉分
}

interface User extends BaseUser, OnChainIdentity {
  // 学习进度
  learningProgress: UserProgress;

  socialAccounts: {
    github?: string;
    discord?: string;
    twitter?: string;
  };

  // 用户偏好设置
  preferences: {
    darkMode: boolean;
    language: "zh" | "en";
    notification: {
      courseUpdate: boolean;
      sbtExpiration: boolean;
      quizReminder: boolean;
      learningReminder: boolean;
    };
    learningGoals?: {
      dailyStudyTime?: number; // 每日学习时长目标（分钟）
      weeklyQuizzes?: number; // 每周测验目标数
      monthlyCompletion?: number; // 每月完成课程目标数
    };
  };
}

interface AuthResponse {
  user: Omit<User, "walletAddress">;
  nonce: string; // 钱包登录用的随机数
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

interface WalletLoginParams {
  signature: string;
  message: string;
  publicAddress: string;
  chainId?: number;
}

export type {
  User,
  AuthResponse,
  WalletLoginParams,
  BaseUser,
  OnChainIdentity,
  LearningProgress,
  CourseProgress,
  LessonProgress,
  QuizProgress,
};
