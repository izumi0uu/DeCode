import { StrapiAttribute, StrapiRelationship, StrapiMedia } from "./commons";
import { CourseAttributes } from "./course";

/**
 * 课程章节属性
 */
export interface LessonAttributes extends StrapiAttribute {
  title: string;
  slug: string;
  description: string;
  content: any; // 富文本内容
  videoUrl: string;
  isPreview: boolean;
  position: number;
  duration: number;
  course: StrapiRelationship<CourseAttributes>;
  quizzes: StrapiRelationship<QuizAttributes>;
  resources: StrapiRelationship<ResourceAttributes>;
}

/**
 * 课程章节类型
 */
export interface Lesson {
  id: number;
  attributes: LessonAttributes;
}

/**
 * 章节列表响应
 */
export interface LessonListResponse {
  data: Lesson[];
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
 * 单个章节响应
 */
export interface LessonResponse {
  data: Lesson;
  meta: {};
}

/**
 * 章节创建请求
 */
export interface LessonCreateRequest {
  data: {
    title: string;
    slug: string;
    description: string;
    content?: any;
    videoUrl?: string;
    isPreview?: boolean;
    position?: number;
    duration?: number;
    course: number; // 关联课程ID
  };
}

/**
 * 章节更新请求
 */
export interface LessonUpdateRequest {
  data: Partial<{
    title: string;
    slug: string;
    description: string;
    content: any;
    videoUrl: string;
    isPreview: boolean;
    position: number;
    duration: number;
    course: number;
  }>;
}
