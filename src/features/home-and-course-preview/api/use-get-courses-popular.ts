import { useQuery } from "@tanstack/react-query";
import type { CourseDetail } from "@/features/types/course";

export const fetchPopularCourses = async () => {
  const response = await fetch(`/api/courses/popular`);
  if (!response.ok) throw new Error("Failed to fetch popular courses");
  return response.json() as Promise<CourseDetail[]>;
};

export const usePopularCourses = () => {
  return useQuery({
    queryKey: ["courses", "popular"],
    queryFn: () => fetchPopularCourses(),
  });
};
