// ├── 动态部分（Strapi管理）
// │   ├── 课程结构树
// │   ├── 导航标签文案
// │   └── 排序规则
// └── 静态部分（代码维护）
//     ├── 图标映射
//     ├── 样式主题
//     └── 路由解析规则

interface NavNode {
  id: string;
  type: "course" | "module" | "unit";
  path: string; // 路径
  title: string;
  sortOrder: number;
  parent?: string; // 父节点ID
  children?: NavNode[]; // 子节点
  metadata?: {
    courseId?: number;
    difficulty?: string;
    completion?: number; //学习进度
    hasQuiz?: boolean;
  };
}

export type { NavNode };
