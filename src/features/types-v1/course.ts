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
  description: string;
  slug: string;
  level: "beginner" | "intermediate" | "advanced";
  difficulty: "easy" | "medium" | "hard";
  duration: number;
  status: "draft" | "published" | "archived";
  published: boolean;
  isPopular: boolean;
  locale: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  coursePublishedAt: string;
  sbtEnabled: boolean;
  sbtContractAddress: string | null;
  category?: { id: number; name: string };
  tags?: { id: number; name: string }[];
  passers?: number;
  learners?: number;
  sortOrder?: number;
}

interface CoursePreview extends Course {
  coverImage?: { url: string };
  contributors?: Pick<Author, "id" | "name" | "avatar">[];
}

interface CourseDetail extends Course {
  contributors: Author[];
  lessons?: { id: number; title: string; slug: string }[];
  resources?: { id: number; title: string; url: string }[];
  progress?: number;
  requirements?: string[];
  related_courses?: CoursePreview[];
}

interface CourseListResponse {
  list: CoursePreview[] | CourseDetail[];
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export type { CoursePreview, CourseDetail, Author, CourseListResponse };
