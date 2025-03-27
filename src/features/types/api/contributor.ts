// src/types/api/contributor.ts
import {
  Media,
  Relation,
  RelationArray,
  StrapiListResponse,
  StrapiResponse,
} from "./common";
import { Course } from "./course";

/**
 * 贡献者角色枚举
 */
export enum ContributorRole {
  AUTHOR = "author",
  INSTRUCTOR = "instructor",
  EDITOR = "editor",
  REVIEWER = "reviewer",
}

/**
 * 贡献者基础属性
 */
export interface Contributor {
  id: number;
  name: string;
  bio: string;
  email: string;
  avatar: Relation<Media>;
  role: ContributorRole;
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  courses: RelationArray<Course>;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建贡献者的输入类型
 */
export type ContributorInput = Omit<
  Contributor,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * 更新贡献者的输入类型
 */
export type ContributorUpdateInput = Partial<ContributorInput>;

/**
 * 贡献者响应类型
 */
export type ContributorResponse = StrapiResponse<Contributor>;

/**
 * 贡献者列表响应类型
 */
export type ContributorListResponse = StrapiListResponse<Contributor>;
