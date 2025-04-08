"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import { useCoursesAndLessonsForPreview } from "../api/use-get-courses-lessons";
import { Course } from "@/features/types/api/course";
import { Lesson } from "@/features/types/api/lesson";
import { TagItem } from "../components/animate-lessons-boxes/TechTags";

// 默认值
const DEFAULT_COURSE_CATEGORY_TAGS = [
  "All",
  "Web3 Basics",
  "Cryptocurrency",
  "Ethereum Development",
  "Digital Assets",
  "DeFi",
  "Web3 Applications",
];

const DEFAULT_TECH_TAGS: TagItem[] = [
  { id: 1, name: "Web3" },
  { id: 2, name: "Blockchain" },
  // ... 其他默认标签
];

// Context接口定义
interface LessonBoxesContextType {
  // 状态
  currentTag: string;
  selectedTagIds: number[];
  selectedTagNames: string[];
  showTechTags: boolean;
  displayTags: string[];
  visibleTechTags: TagItem[];
  filteredCourses: Course[];
  filteredLessons: Lesson[];
  isLoading: boolean;

  // 动作
  handleTagClick: (tag: string) => void;
  handleTechTagClick: (tagId: number, tagName: string) => void;
  clearSelectedTags: () => void;
  toggleTechTags: () => void;
  handleExplore: () => void;
}

// 创建Context
const LessonBoxesContext = createContext<LessonBoxesContextType | undefined>(
  undefined
);

// Provider Props
interface LessonBoxesProviderProps {
  children: ReactNode;
  initialTag?: string;
  tagList?: string[];
  onTagSelect?: (tag: string) => void;
}

// Provider组件
export function LessonBoxesProvider({
  children,
  initialTag = "All",
  tagList: propTagList,
  onTagSelect,
}: LessonBoxesProviderProps) {
  // 获取课程数据
  const { data, isLoading } = useCoursesAndLessonsForPreview();

  // 组件状态
  const [currentTag, setCurrentTag] = useState(initialTag);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [selectedTagNames, setSelectedTagNames] = useState<string[]>([]);
  const [showTechTags, setShowTechTags] = useState(false);

  // 从API中提取课程分类标签
  const apiTags = useMemo(() => {
    if (!data?.courses?.length) return DEFAULT_COURSE_CATEGORY_TAGS;

    const uniqueTags = new Set(["All"]);

    data.courses.forEach((course) => {
      if (course.shortTitleTag) {
        uniqueTags.add(course.shortTitleTag);
      } else {
        const shortTitle = course.title.split(" ").slice(0, 2).join(" ");
        uniqueTags.add(shortTitle);
      }
    });

    return Array.from(uniqueTags);
  }, [data?.courses]);

  // 用于UI显示的标签列表
  const displayTags = useMemo(
    () => propTagList || apiTags,
    [propTagList, apiTags]
  );

  // 构建课程类别到技术标签的映射
  const categoryToTechTagsMap = useMemo(() => {
    if (!data?.courses?.length) {
      return { All: DEFAULT_TECH_TAGS };
    }

    const mapping: Record<string, TagItem[]> = {};
    const allTechTagsMap = new Map<number, TagItem>();

    data.courses.forEach((course) => {
      let categoryKey =
        course.shortTitleTag ||
        course.category?.name ||
        course.title.split(" ").slice(0, 2).join(" ");

      if (!mapping[categoryKey]) {
        mapping[categoryKey] = [];
      }

      if (course.tags?.length) {
        course.tags.forEach((tag) => {
          if (tag.id && tag.name) {
            const tagItem: TagItem = { id: tag.id, name: tag.name };

            if (!mapping[categoryKey].some((t) => t.id === tag.id)) {
              mapping[categoryKey].push(tagItem);
            }

            allTechTagsMap.set(tag.id, tagItem);
          }
        });
      }
    });

    mapping["All"] = allTechTagsMap.size
      ? Array.from(allTechTagsMap.values())
      : DEFAULT_TECH_TAGS;

    Object.keys(mapping).forEach((key) => {
      if (key !== "All" && (!mapping[key] || !mapping[key].length)) {
        mapping[key] = mapping["All"].slice(
          0,
          Math.min(3, mapping["All"].length)
        );
      }
    });

    return mapping;
  }, [data?.courses]);

  // 当前类别的可见技术标签
  const visibleTechTags = useMemo(() => {
    return categoryToTechTagsMap[currentTag] || DEFAULT_TECH_TAGS;
  }, [currentTag, categoryToTechTagsMap]);

  // 筛选课程列表
  const filteredCourses = useMemo(() => {
    if (!data?.courses) return [];

    return data.courses.filter((course) => {
      const matchesCategory =
        currentTag === "All" ||
        course.shortTitleTag === currentTag ||
        course.category?.name === currentTag ||
        course.title.split(" ").slice(0, 2).join(" ") === currentTag;

      if (!matchesCategory) return false;

      if (selectedTagIds.length && course.tags?.length) {
        return selectedTagIds.every((selectedId) =>
          course.tags.some((tag) => tag.id === selectedId)
        );
      }

      return matchesCategory;
    });
  }, [data?.courses, currentTag, selectedTagIds]);

  // 筛选课时列表
  const filteredLessons = useMemo(() => {
    if (!data?.lessons?.length || !data?.courses?.length) return [];

    const extractTagIds = (tagData: any): number[] => {
      if (!tagData) return [];

      if (tagData.data && Array.isArray(tagData.data)) {
        return tagData.data.map((tag: any) => tag.id).filter(Boolean);
      }

      if (Array.isArray(tagData)) {
        return tagData.map((tag: any) => tag.id).filter(Boolean);
      }

      return [];
    };

    const courseIds =
      currentTag === "All"
        ? data.courses.map((course) => course.id)
        : filteredCourses.map((course) => course.id);

    let filtered = data.lessons.filter(
      (lesson) => lesson.course && courseIds.includes(lesson.course.id)
    );

    if (selectedTagIds.length) {
      filtered = filtered.filter((lesson) => {
        const lessonAny = lesson as any;
        const lessonTagIds = extractTagIds(lessonAny.tags);

        if (lessonTagIds.length > 0) {
          const matchesAllTags = selectedTagIds.every((tagId) =>
            lessonTagIds.includes(tagId)
          );
          if (matchesAllTags) {
            return true;
          }
        }

        return false;
      });
    }

    return filtered;
  }, [
    data?.lessons,
    data?.courses,
    currentTag,
    filteredCourses,
    selectedTagIds,
  ]);

  // 同步外部initialTag变化
  useEffect(() => {
    if (initialTag && initialTag !== currentTag) {
      setCurrentTag(initialTag);
      setSelectedTagIds([]);
      setSelectedTagNames([]);
    }
  }, [initialTag, currentTag]);

  // 处理课程分类标签点击
  const handleTagClick = useCallback(
    (tag: string) => {
      if (tag !== currentTag) {
        setCurrentTag(tag);
        setSelectedTagIds([]);
        setSelectedTagNames([]);
        setShowTechTags(true);

        if (onTagSelect) {
          onTagSelect(tag);
        }
      }
    },
    [currentTag, onTagSelect]
  );

  // 处理技术标签点击
  const handleTechTagClick = useCallback((tagId: number, tagName: string) => {
    setSelectedTagIds((prev) => {
      if (prev.includes(tagId)) {
        setSelectedTagNames((currentNames) =>
          currentNames.filter((name) => name !== tagName)
        );
        return prev.filter((id) => id !== tagId);
      }
      setSelectedTagNames((currentNames) => [...currentNames, tagName]);
      return [...prev, tagId];
    });
  }, []);

  // 清除所有选中的技术标签
  const clearSelectedTags = useCallback(() => {
    setSelectedTagIds([]);
    setSelectedTagNames([]);
  }, []);

  // 切换技术标签显示
  const toggleTechTags = useCallback(() => {
    setShowTechTags((prev) => !prev);
  }, []);

  // 处理"探索"按钮点击
  const handleExplore = useCallback(() => {
    // 这里需要添加样式类的引用，假设已导入了styles
    const tagSection = document.querySelector(".categorySectionTitle");
    if (tagSection) {
      const yOffset =
        tagSection.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({ top: yOffset, behavior: "smooth" });
    }
  }, []);

  // Context值
  const contextValue = useMemo(
    () => ({
      currentTag,
      selectedTagIds,
      selectedTagNames,
      showTechTags,
      displayTags,
      visibleTechTags,
      filteredCourses,
      filteredLessons,
      isLoading,
      handleTagClick,
      handleTechTagClick,
      clearSelectedTags,
      toggleTechTags,
      handleExplore,
    }),
    [
      currentTag,
      selectedTagIds,
      selectedTagNames,
      showTechTags,
      displayTags,
      visibleTechTags,
      filteredCourses,
      filteredLessons,
      isLoading,
      handleTagClick,
      handleTechTagClick,
      clearSelectedTags,
      toggleTechTags,
      handleExplore,
    ]
  );

  return (
    <LessonBoxesContext.Provider value={contextValue}>
      {children}
    </LessonBoxesContext.Provider>
  );
}

// 自定义Hook用于访问Context
export function useLessonBoxes() {
  const context = useContext(LessonBoxesContext);
  if (context === undefined) {
    throw new Error("useLessonBoxes must be used within a LessonBoxesProvider");
  }
  return context;
}
