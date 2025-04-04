// src/features/types/api/api-responses.ts
import { StrapiError } from "./common";
import { CourseListResponse, CourseResponse } from "./course";
import {
  LessonListResponse,
  LessonResponse,
  LessonLightListResponse,
} from "./lesson";
import { QuizListResponse, QuizResponse } from "./quiz";
import {
  QuizQuestionListResponse,
  QuizQuestionResponse,
} from "./quiz-question";
import { QuizOptionListResponse, QuizOptionResponse } from "./quiz-option";
import { QuizAnswerListResponse } from "./quiz-answer";
import { UserQuizProgressListResponse } from "./user-quiz-progress";
import { UserLessonProgressListResponse } from "./user-lesson-progress";
import { UserCourseProgressListResponse } from "./user-course-progress";
import { ContributorListResponse } from "./contributor";
import { ResourceListResponse } from "./resource";
import { SbtCertificationListResponse } from "./sbt-certification";
import { UserWalletListResponse } from "./user-wallet";
import { TokenRewardListResponse } from "./token-reward";
import { QuizMaterialListResponse } from "./quiz-material";
import { ThematicQueryListResponse } from "./thematic-query";
import { ThematicResponseListResponse } from "./thematic-response";
import { BlockchainConfigResponse } from "./blockchain-config";
import { TokenomicsConfigResponse } from "./tokenomics-config";
import { LearningPathConfigListResponse } from "./learning-path-config";
import { HomePageSettingResponse } from "./home-page-setting";
import { WebsiteConfigurationResponse } from "./website-configuration";

/**
 * 导出Strapi API原始响应类型
 * 这些类型直接映射后端API返回的数据结构
 * 主要用于API调用层处理原始响应
 */
export type {
  // 错误响应
  StrapiError,

  // 课程相关
  CourseListResponse,
  CourseResponse,

  // 章节相关
  LessonListResponse,
  LessonResponse,
  LessonLightListResponse,

  // 测验相关
  QuizListResponse,
  QuizResponse,
  QuizQuestionListResponse,
  QuizQuestionResponse,
  QuizOptionListResponse,
  QuizOptionResponse,
  QuizAnswerListResponse,

  // 用户进度相关
  UserQuizProgressListResponse,
  UserLessonProgressListResponse,
  UserCourseProgressListResponse,

  // 社区互动相关
  ContributorListResponse,
  ResourceListResponse,

  // 区块链相关
  SbtCertificationListResponse,
  UserWalletListResponse,
  TokenRewardListResponse,

  // 配置相关
  QuizMaterialListResponse,
  ThematicQueryListResponse,
  ThematicResponseListResponse,
  BlockchainConfigResponse,
  TokenomicsConfigResponse,
  LearningPathConfigListResponse,
  HomePageSettingResponse,
  WebsiteConfigurationResponse,
};
