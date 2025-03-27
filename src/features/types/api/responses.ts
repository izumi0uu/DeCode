import { ApiError } from "./common";
import { CourseListResponse, CourseResponse } from "./course";
import { LessonListResponse, LessonResponse } from "./lesson";
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

export type {
  ApiError,
  CourseListResponse,
  CourseResponse,
  LessonListResponse,
  LessonResponse,
  QuizListResponse,
  QuizResponse,
  QuizQuestionListResponse,
  QuizQuestionResponse,
  QuizOptionListResponse,
  QuizOptionResponse,
  QuizAnswerListResponse,
  UserQuizProgressListResponse,
  UserLessonProgressListResponse,
  UserCourseProgressListResponse,
  ContributorListResponse,
  ResourceListResponse,
  SbtCertificationListResponse,
  UserWalletListResponse,
  TokenRewardListResponse,
  QuizMaterialListResponse,
  ThematicQueryListResponse,
  ThematicResponseListResponse,
  BlockchainConfigResponse,
  TokenomicsConfigResponse,
  LearningPathConfigListResponse,
  HomePageSettingResponse,
  WebsiteConfigurationResponse,
};
