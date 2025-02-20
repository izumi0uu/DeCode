interface Author {
  id: number;
  bio?: string;
  name?: string;
  avatar?: string;
  email: string;
  username?: string;
  nickname?: string;
  github_id?: number;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    personal_website?: string;
  };
  // 链上身份验证
  verified_contract_address?: string; // 认证的智能合约地址
}

interface Course {
  id: number;
  title: string;
  shortDescription: string;
  lang: "en" | "zh";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: "draft" | "published" | "archived";
  tags: string[];
  passers: number;
  learners: number;
  study_time: number;
  created_at: string;
  updated_at: string;
  sort: number;
}

interface CoursePreview extends Course {
  short_description: string;
  difficulty_badge: string;
  thumbnail: string;
  author: Pick<Author, "id" | "name" | "avatar">;
  content: string;
}

interface CourseDetail extends Course {
  content: string;
  content_url: string;
  author: Author;
  sbt_contract_address?: string; // 链上合约地址
  ipfs_hash: string; // 课程内容IPFS哈希
  progress: number;
  requirements: string[];
  related_courses: CoursePreview[];
}

interface CourseListResponse {
  list: CoursePreview[] | CourseDetail[];
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
  };
}

// declare module "@strapi/types" {
//   export module Shared {
//     interface ContentTypes {
//       "course.course": CourseDetail & {
//         id: number;
//         createdAt: string;
//         updatedAt: string;
//         publishedAt: string;
//       };
//     }
//   }
// }

export type { CoursePreview, CourseDetail, Author, CourseListResponse };
