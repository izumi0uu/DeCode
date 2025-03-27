// src/types/api/course.ts
import {
  Media,
  Relation,
  RelationArray,
  StrapiListResponse,
  StrapiResponse,
} from "./common";
import { Category } from "./category";
import { Tag } from "./tag";
import { Contributor } from "./contributor";
import { Lesson } from "./lesson";

/**
 * 课程难度枚举
 */
export enum CourseDifficulty {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

/**
 * 课程基础属性
 */
export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage: Relation<Media>;
  isPopular: boolean;
  isFeatured: boolean;
  published: boolean;
  publishedAt: string | null;
  difficulty: CourseDifficulty;
  duration: number; // 课程时长（分钟）
  prerequisites: string;
  learningObjectives: string;
  locale: string;
  category: Relation<Category>;
  tags: RelationArray<Tag>;
  author: Relation<Contributor>;
  lessons: RelationArray<Lesson>;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建课程的输入类型
 */
export type CourseInput = Omit<
  Course,
  "id" | "createdAt" | "updatedAt" | "publishedAt"
>;

/**
 * 更新课程的输入类型
 */
export type CourseUpdateInput = Partial<CourseInput>;

/**
 * 课程响应类型
 */
export type CourseResponse = StrapiResponse<Course>;

/**
 * 课程列表响应类型
 */
export type CourseListResponse = StrapiListResponse<Course>;
