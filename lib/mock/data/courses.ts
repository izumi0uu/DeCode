import { NavNode } from "@/types/navigation";

export const mockNavigation: NavNode[] = [
  {
    id: "course-1",
    type: "course",
    path: "/courses/1",
    title: "React 基础教程",
    sortOrder: 1,
    metadata: {
      courseId: 1,
      difficulty: "beginner",
      completion: 60,
      hasQuiz: true,
    },
    children: [
      {
        id: "module-1",
        type: "module",
        path: "/courses/1/module-1",
        title: "React 核心概念",
        sortOrder: 1,
        parent: "course-1",
        children: [
          {
            id: "unit-1",
            type: "unit",
            path: "/courses/1/module-1/unit-1",
            title: "JSX 语法",
            sortOrder: 1,
            parent: "module-1",
            metadata: {
              completion: 100,
              hasQuiz: true,
            },
          },
          {
            id: "unit-2",
            type: "unit",
            path: "/courses/1/module-1/unit-2",
            title: "组件与属性",
            sortOrder: 2,
            parent: "module-1",
            metadata: {
              completion: 30,
              hasQuiz: false,
            },
          },
        ],
      },
    ],
  },
  {
    id: "course-2",
    type: "course",
    path: "/courses/2",
    title: "TypeScript 进阶",
    sortOrder: 2,
    metadata: {
      courseId: 2,
      difficulty: "intermediate",
      completion: 20,
      hasQuiz: true,
    },
    children: [
      {
        id: "module-2",
        type: "module",
        path: "/courses/2/module-1",
        title: "类型系统",
        sortOrder: 1,
        parent: "course-2",
        metadata: {
          completion: 20,
        },
      },
    ],
  },
  {
    id: "course-3",
    type: "course",
    path: "/courses/3",
    title: "Next.js 实战",
    sortOrder: 3,
    metadata: {
      courseId: 3,
      difficulty: "advanced",
      completion: 0,
      hasQuiz: false,
    },
  },
];
