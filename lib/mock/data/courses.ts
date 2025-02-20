import { CourseDetail } from "@/types";

const mockCourses: CourseDetail[] = [
  {
    id: 1,
    title: "Web3 基础入门",
    shortDescription: "区块链和 Web3 基础知识",
    lang: "zh",
    difficulty: "Beginner",
    status: "published",
    tags: ["Web3", "Blockchain", "Ethereum"],
    passers: 1200,
    learners: 2800,
    study_time: 150,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
    sort: 1,
    content: "Web3 基础课程内容...",
    content_url: "https://api.example.com/courses/1/content",
    author: {
      id: 1,
      name: "张三",
      avatar: "https://example.com/avatars/1.jpg",
      bio: "张三的简介",
      email: "zhangsan@example.com",
      username: "zhangsan",
      nickname: "张三",
    },
    sbt_contract_address: "0x1234...",
    ipfs_hash: "Qm...",
    progress: 0,
    requirements: ["JavaScript 基础"],
    related_courses: [],
  },
];

export { mockCourses };
