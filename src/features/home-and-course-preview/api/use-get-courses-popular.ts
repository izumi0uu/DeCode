import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import type { CourseListResponse } from "@/features/types/api/course";

const fetchPopularCourses = async () => {
  const queryString = qs.stringify({
    populate: ["coverImage"],
    filters: {
      isPopular: {
        $eq: true,
      },
    },
  });

  const response = await fetch(`/api/courses?${queryString}`);
  if (!response.ok) throw new Error("Failed to fetch popular courses");

  return response.json() as Promise<CourseListResponse>;
};

export const usePopularCourses = () => {
  return useQuery({
    queryKey: ["courses", "popular"],
    queryFn: () => fetchPopularCourses(),
  });
};
