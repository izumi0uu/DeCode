import { Author } from "./course";

interface Lesson {
  id: number;
  title: string;
  slug: string;
  description?: string;
  duration: number;
  sortOrder: number;
  content?: any;
  videoUrl?: string;
  isPreview: boolean;
  status: "draft" | "published" | "archived";
  locale: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;

  course?: {
    data: {
      id: number;
      attributes: any;
    };
  };
  course_id?: number;

  path?: string;
  keywords?: string;
}

interface LessonDetail extends Lesson {
  content_url?: string;
  passers?: number;
  learners?: number;
  progress?: number;

  author?: Author;

  quizzes?: {
    data: Array<{
      id: number;
      attributes: any;
    }>;
  };
  resources?: {
    data: Array<{
      id: number;
      attributes: any;
    }>;
  };
}

// Strapi 响应格式
interface StrapiLessonResponse {
  data: Array<{
    id: number;
    attributes: Omit<Lesson, "id" | "course_id"> & {
      course: {
        data: {
          id: number;
          attributes: any;
        };
      };
      quizzes?: {
        data: Array<{
          id: number;
          attributes: any;
        }>;
      };
      resources?: {
        data: Array<{
          id: number;
          attributes: any;
        }>;
      };
    };
  }>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export type { Lesson, LessonDetail, StrapiLessonResponse };
