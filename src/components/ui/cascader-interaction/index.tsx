"use client";

import * as React from "react";
import { CascaderProps } from "@/components/ui/cascader";
import { NavNode } from "@/features/types/ui/nav-node";
import { useRouter } from "next/navigation";

interface CascaderInteractionProps {
  children: React.ReactNode;
  onSelect?: (path: string) => void;
  navigationData: NavNode[] | undefined;
  activeCourse: NavNode | null;
  setActiveCourse: (course: NavNode | null) => void;
  setIsChangingCourse: (isChanging: boolean) => void;
  coursesColumnRef: React.RefObject<HTMLDivElement>;
}

// 提取通用的元素增强函数
function enhanceCourseElement(
  element: React.ReactElement,
  course: NavNode,
  handleClick: (e: React.MouseEvent, course: NavNode) => void,
  handleHover: (course: NavNode) => void
): React.ReactElement {
  return React.cloneElement(element, {
    onClick: (e: React.MouseEvent) => handleClick(e, course),
    onMouseEnter: () => handleHover(course),
    "data-course-id": course.id,
    "data-path": course.path || "",
  } as React.HTMLAttributes<HTMLElement>);
}

// 提取课时元素增强函数
function enhanceLessonElement(
  element: React.ReactElement,
  lesson: NavNode,
  handleClick: (e: React.MouseEvent, path: string) => void
): React.ReactElement {
  return React.cloneElement(element, {
    onClick: (e: React.MouseEvent) => handleClick(e, lesson.path),
    "data-lesson-id": lesson.id,
    "data-path": lesson.path || "",
  } as React.HTMLAttributes<HTMLElement>);
}

const CascaderInteraction = ({
  children,
  onSelect,
  navigationData,
  activeCourse,
  setActiveCourse,
  setIsChangingCourse,
  coursesColumnRef,
}: CascaderInteractionProps) => {
  const router = useRouter();
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // 处理路径选择
  const handlePathSelect = (path: string) => {
    if (path && onSelect) onSelect(path);
  };

  // 滚动到指定课程
  const scrollToCourse = (courseId: string) => {
    if (coursesColumnRef.current && navigationData) {
      const index = navigationData.findIndex(
        (course) => course.id === courseId
      );
      if (index !== -1) {
        const container = coursesColumnRef.current;
        const scrollHeight = container.scrollHeight;
        const itemHeight = scrollHeight / navigationData.length;

        // 计算目标滚动位置
        const scrollTo = itemHeight * index;
        container.scrollTo({
          top: scrollTo,
          behavior: "smooth",
        });
      }
    }
  };

  // 处理课程点击
  const handleCourseClick = (e: React.MouseEvent, course: NavNode) => {
    e.stopPropagation();
    setActiveCourse(course);
    scrollToCourse(course.id);

    // 如果有路径就跳转到指定路由
    if (course.path) {
      router.push(course.path);
    }
  };

  // 处理课时点击
  const handleLessonClick = (e: React.MouseEvent, lessonPath: string) => {
    e.stopPropagation();
    if (lessonPath) {
      router.push(lessonPath);
    }
  };

  // 处理鼠标悬停在课程上的事件
  const handleCourseHover = (course: NavNode) => {
    // 防止频繁触发 hover 事件，增加延迟
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      if (activeCourse?.id !== course.id) {
        setIsChangingCourse(true);
        setActiveCourse(course);

        // 动画结束后重置状态
        setTimeout(() => {
          setIsChangingCourse(false);
        }, 300);
      }
    }, 100); // 100ms 延迟，避免鼠标快速经过时频繁切换
  };

  // 增强子元素，添加事件处理
  const enhanceChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      // 如果不是有效的React元素，直接返回
      if (!React.isValidElement(child)) return child;

      const element = child as React.ReactElement;
      const props = element.props as any;
      const className = props?.className as string | undefined;

      // 处理课程元素
      if (className && className.includes("course")) {
        const course = navigationData?.find((c) => c.id === element.key);
        if (course) {
          return enhanceCourseElement(
            element,
            course,
            handleCourseClick,
            handleCourseHover
          );
        }
      }

      // 处理课时元素
      if (className && className.includes("lessonItem")) {
        const lesson = activeCourse?.children?.find(
          (l) => l.id === element.key
        );
        if (lesson) {
          return enhanceLessonElement(element, lesson, handleLessonClick);
        }
      }

      // 递归处理子元素
      if (props?.children) {
        return React.cloneElement(
          element,
          { ...props } as React.HTMLAttributes<HTMLElement>,
          enhanceChildren(props.children)
        );
      }

      return element;
    });
  };

  return <div>{enhanceChildren(children)}</div>;
};

export { CascaderInteraction };
