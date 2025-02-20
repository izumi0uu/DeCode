import { Suspense } from "react";
import { Flex } from "@/once-ui/components";
import { NavNode } from "@/types";
import { fetchNavigation } from "@/lib/mock/api/navigation";

interface CascaderProps {
  data: NavNode[];
  onSelect: (path: string) => void;
  currentPath?: string;
}

const Cascader = async ({ data, onSelect }: CascaderProps) => {
  const navigation = await fetchNavigation();
  // const [courses, lessons, quizzes, useProgress] = await Promise.all([
  //   fetch(`${process.env.STRAPI_URL}/api/courses`),
  //   fetch(`${process.env.STRAPI_URL}/api/lessons`),
  //   fetch(`${process.env.STRAPI_URL}/api/quizzes`),
  //   fetch(`${process.env.STRAPI_URL}/api/user-progress`),
  // ]);
};

export { Cascader };
