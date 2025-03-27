// src/types/api/lesson.ts
import {
  Media,
  Relation,
  RelationArray,
  StrapiListResponse,
  StrapiResponse,
} from "./common";
import { Course } from "./course";
import { Quiz } from "./quiz";

/**
 * 章节类型枚举
 */
export enum LessonType {
  VIDEO = "video",
  TEXT = "text",
  CODE = "code",
  MIXED = "mixed",
}

/**
 * 章节基础属性
 */
export interface Lesson {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage: Relation<Media>;
  videoUrl: string | null;
  type: LessonType;
  position: number; // 章节在课程中的排序位置
  duration: number; // 章节时长（分钟）
  isPreview: boolean; // 是否为免费预览章节
  published: boolean;
  lessonPublishedAt: string | null;
  course: Relation<Course>;
  quiz: Relation<Quiz>;
  createdAt: string;
  updatedAt: string;
  sortOrder: number;
}

/**
 * 创建章节的输入类型
 */
export type LessonInput = Omit<
  Lesson,
  "id" | "createdAt" | "updatedAt" | "publishedAt"
>;

/**
 * 更新章节的输入类型
 */
export type LessonUpdateInput = Partial<LessonInput>;

/**
 * 章节响应类型
 */
export type LessonResponse = StrapiResponse<Lesson>;

/**
 * 章节列表响应类型
 */
export type LessonListResponse = StrapiListResponse<Lesson>;

/**
 * 轻量级章节接口，不包含 content 字段
 * 适用于列表显示和导航
 */
export type LessonLight = Omit<Lesson, "content">;

/**
 * 轻量级章节列表响应类型
 */
export type LessonLightListResponse = StrapiListResponse<LessonLight>;
