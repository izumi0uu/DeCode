import { useQuery } from "@tanstack/react-query";
import type { CourseResponse } from "@/features/types/api/course";

export const fetchPopularCourses = async () => {
  const response = await fetch(`/api/courses/popular`);
  if (!response.ok) throw new Error("Failed to fetch popular courses");
  return response.json() as Promise<CourseResponse[]>;
};

export const usePopularCourses = () => {
  return useQuery({
    queryKey: ["courses", "popular"],
    queryFn: () => fetchPopularCourses(),
  });
};
