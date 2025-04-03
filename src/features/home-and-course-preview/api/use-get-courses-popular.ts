import { useQuery } from "@tanstack/react-query";
// @ts-ignore
import qs from "qs"; // 添加ts-ignore以临时解决qs模块类型声明问题
import type { CourseListResponse, Course } from "@/features/types/api/course";
import { ApiDataResponse, HookResponse } from "@/features/types/api/common";

const fetchPopularCourses = async (): Promise<ApiDataResponse<Course[]>> => {
  try {
    const queryString = qs.stringify({
      populate: ["coverImage", "tags"],
      filters: {
        isPopular: {
          $eq: true,
        },
      },
    });

    const response = await fetch(`/api/courses?${queryString}`);
    if (!response.ok) throw new Error("Failed to fetch popular courses");

    const result = (await response.json()) as CourseListResponse;
    return {
      data: result.data,
      meta: {
        isLoading: false,
        isError: false,
        error: null,
      },
    };
  } catch (error) {
    return {
      data: [],
      meta: {
        isLoading: false,
        isError: true,
        error,
      },
    };
  }
};

export const usePopularCourses = (): HookResponse<Course[]> => {
  const query = useQuery({
    queryKey: ["courses", "popular"],
    queryFn: fetchPopularCourses,
  });

  return {
    data: query.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
