import { StrapiAttribute, StrapiRelationship, StrapiMedia } from "./commons";
import { LessonAttributes } from "./lesson";
import { CategoryAttributes } from "./category";
import { TagAttributes } from "./tag";
import { ContributorAttributes } from "./contributor";

/**
 * 课程难度级别
 */
export type CourseDifficultyLevel = "beginner" | "intermediate" | "advanced";

/**
 * 课程属性类型
 */
export interface CourseAttributes extends StrapiAttribute {
  title: string;
  slug: string;
  description: string;
  content: string;
  duration: number;
  difficulty: CourseDifficultyLevel;
  published: boolean;
  isPopular: boolean;
  sbtEnabled: boolean;
  sbtContractAddress: string | null;
  coverImage: StrapiMedia;
  lessons: StrapiRelationship<LessonAttributes>;
  categories: StrapiRelationship<CategoryAttributes>;
  tags: StrapiRelationship<TagAttributes>;
  contributors: StrapiRelationship<ContributorAttributes>;
}

/**
 * 课程类型
 */
export interface Course {
  id: number;
  attributes: CourseAttributes;
}

/**
 * 课程列表响应
 */
export interface CourseListResponse {
  data: Course[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * 单个课程响应
 */
export interface CourseResponse {
  data: Course;
  meta: {};
}

/**
 * 课程创建请求
 */
export interface CourseCreateRequest {
  data: {
    title: string;
    slug: string;
    description: string;
    content?: string;
    duration?: number;
    difficulty?: CourseDifficultyLevel;
    published?: boolean;
    isPopular?: boolean;
    sbtEnabled?: boolean;
    sbtContractAddress?: string | null;
  };
}

/**
 * 课程更新请求
 */
export interface CourseUpdateRequest {
  data: Partial<{
    title: string;
    slug: string;
    description: string;
    content: string;
    duration: number;
    difficulty: CourseDifficultyLevel;
    published: boolean;
    isPopular: boolean;
    sbtEnabled: boolean;
    sbtContractAddress: string | null;
  }>;
}
