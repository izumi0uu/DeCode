import { LessonDetail } from "@/types";
import { mockCourses } from "./courses";

const mockLessons: LessonDetail[] = [
  {
    id: 1,
    course_id: 1,
    sort: 1,
    path: "/courses/1/lessons/1",
    lang: "zh",
    title: "什么是区块链",
    status: "published",
    keywords: "blockchain,web3",
    study_time: 30,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
    content: "区块链基础内容...",
    content_url: "https://api.example.com/lessons/1/content",
    passers: 2000,
    learners: 2800,
    progress: 0,
    author: mockCourses[0].author,
  },
  {
    id: 2,
    course_id: 1,
    sort: 2,
    path: "/courses/1/lessons/2",
    lang: "zh",
    title: "以太坊基础",
    status: "published",
    keywords: "ethereum,web3",
    study_time: 45,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
    content: "以太坊基础内容...",
    content_url: "https://api.example.com/lessons/2/content",
    passers: 1800,
    learners: 2800,
    progress: 0,
    author: mockCourses[0].author,
  },
];

export { mockLessons };
