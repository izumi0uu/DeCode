import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { Course } from "@/features/types/api/course";
import { usePopularCourses } from "@/features/home-and-course-preview/api/use-get-courses-popular";

// 创建一个课程数据Context
const CourseContext = createContext<{
  courses: Course[] | undefined;
  activeCourseId: number | null;
  setActiveCourseId: (id: number | null) => void;
}>({
  courses: undefined,
  activeCourseId: null,
  setActiveCourseId: () => {},
});

// 提供课程数据的Provider组件
export const CourseContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { data } = usePopularCourses();
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);

  // 使用useMemo缓存课程数据，防止重新渲染时重新创建
  const courseContextValue = useMemo(
    () => ({
      courses: data,
      activeCourseId,
      setActiveCourseId,
    }),
    [data, activeCourseId, setActiveCourseId]
  );

  return (
    <CourseContext.Provider value={courseContextValue}>
      {children}
    </CourseContext.Provider>
  );
};

// 自定义hook方便获取context
export const useCourseContext = () => useContext(CourseContext);
