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

// 学习进度跟踪 - 与 UserProgress 保持一致
interface CourseProgress {
  progress: number; // 课程总进度（0-100）
  lastAccessed: string; // 最后访问时间
  completed?: boolean; // 是否完成
  startedAt?: string; // 开始学习时间
  completedAt?: string; // 完成时间
}

interface LessonProgress {
  progress: number; // 章节进度（0-100）
  lastAccessed: string; // 最后访问时间
  completed?: boolean; // 是否完成
  startedAt?: string; // 开始学习时间
  completedAt?: string; // 完成时间
  timeSpent?: number; // 学习时长（分钟）
}

interface QuizProgress {
  attempts: number; // 尝试次数
  highestScore: number; // 最高分数
  lastAttempt: string; // 最后尝试时间
  passed?: boolean; // 是否通过
  attemptsLeft?: number; // 剩余尝试次数
  lastScore?: number; // 最近一次分数
}

interface LearningProgress {
  courses: {
    [courseId: number]: CourseProgress;
  };
  lessons: {
    [lessonId: number]: LessonProgress;
  };
  quizzes: {
    [quizId: string]: QuizProgress;
  };

  // 学习统计
  statistics: {
    totalCourses: number;
    completedCourses: number;
    totalLessons: number;
    completedLessons: number;
    totalQuizzes: number;
    passedQuizzes: number;
    totalTimeSpent: number; // 总学习时长（分钟）
    averageScore: number; // 平均测验分数
  };
}

interface User extends BaseUser, OnChainIdentity, LearningProgress {
  // 学习进度
  learningProgress: LearningProgress;

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
