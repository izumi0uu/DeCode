// src/features/course/api/use-get-courses.ts
import { useQuery } from "@tanstack/react-query";
import type { CourseDetail } from "@/features/types/course";

export type CoursesFilters = {
  category?: string;
  level?: string;
  search?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
};

export const fetchCourses = async (filters: CoursesFilters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(`${key}[]`, v));
      } else {
        params.append(key, String(value));
      }
    }
  });

  const response = await fetch(`/api/courses?${params.toString()}`);

  if (!response.ok) throw new Error("Failed to fetch courses");

  return response.json() as Promise<{
    data: CourseDetail[];
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  }>;
};

export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => fetchCourses(),
  });
};
