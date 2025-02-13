import { Author } from "./course";

interface Lesson {
  id: number;
  course_id: number;
  sort: number;
  path: string;
  lang: "en" | "zh";
  title: string;
  status: "draft" | "published" | "archived";
  keywords: string;
  study_time: number;
  created_at: string;
  updated_at: string;
}

interface LessonDetail extends Lesson {
  content: string;
  content_url: string;
  passers: number;
  learners: number;
  progress: number;
  author: Author;
}

export type { Lesson, LessonDetail };
