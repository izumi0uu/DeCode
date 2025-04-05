import React, { useCallback, useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Text, Flex, Button } from "@/once-ui/components";
import { useCoursesAndLessonsForPreview } from "@/features/home-and-course-preview/api/use-get-courses-lessons";
import { LessonLight } from "@/features/types/api/lesson";
import { Tag } from "@/features/types/api/tag";
import { Course } from "@/features/types/api/course";
import { Banner } from "./Banner";
import { CategoryTags } from "./CategoryTags";
import { TechTags, TagItem } from "./TechTags"; // 导入新的TagItem接口
import { CourseDisplay } from "./LessonDisplay";
import styles from "./index.module.scss";

// 主组件接口
interface AnimateCoursesBoxesProps {
  tagList?: string[];
  currentTag?: string;
  onTagSelect?: (tag: string) => void;
}

// 动画变体定义 - 集中管理动画配置
const animations = {
  fadeIn: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// 默认标签和技术标签 - 移到组件外部避免重复创建
const DEFAULT_COURSE_CATEGORY_TAGS = [
  "All",
  "Web3 Basics",
  "Cryptocurrency",
  "Ethereum Development",
  "Digital Assets",
  "DeFi",
  "Web3 Applications",
];

// 默认技术标签，改为带ID的格式
const DEFAULT_TECH_TAGS: TagItem[] = [
  { id: 1, name: "Web3" },
  { id: 2, name: "Blockchain" },
  { id: 3, name: "Web3 Infrastructure" },
  { id: 4, name: "Web3 Development" },
  { id: 5, name: "Consensus Mechanism" },
  { id: 6, name: "Wallet Security" },
  { id: 7, name: "DApp" },
  { id: 8, name: "Cryptocurrency" },
  { id: 9, name: "Ethereum" },
  { id: 10, name: "Smart Contract" },
  { id: 11, name: "NFT" },
];

// 使用memo优化子组件渲染
const MemoizedBanner = memo(Banner);
const MemoizedCategoryTags = memo(CategoryTags);
const MemoizedTechTags = memo(TechTags);
const MemoizedCourseDisplay = memo(CourseDisplay);

export const AnimateCoursesBoxes = (props: AnimateCoursesBoxesProps = {}) => {
  // 解构属性
  const {
    tagList: propTagList,
    currentTag: propCurrentTag,
    onTagSelect,
  } = props;

  // 获取课程数据 - 使用React Query提供的状态
  const { data, isLoading } = useCoursesAndLessonsForPreview();

  // 组件状态 - 减少状态数量和更新频率
  const [internalTag, setInternalTag] = useState(propCurrentTag || "All");
  // 存储标签ID而不是名称
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  // 用于前端展示需要的标签名称
  const [selectedTagNames, setSelectedTagNames] = useState<string[]>([]);
  const [showTechTags, setShowTechTags] = useState(false);

  // 从API中提取课程分类标签 - 优化计算逻辑
  const apiTags = useMemo(() => {
    if (!data?.courses?.length) return DEFAULT_COURSE_CATEGORY_TAGS;

    // 使用Set来存储唯一标签
    const uniqueTags = new Set(["All"]);

    // 一次遍历中提取所有标签
    data.courses.forEach((course) => {
      if (course.shortTitleTag) {
        uniqueTags.add(course.shortTitleTag);
      } else if (course.category?.name) {
        uniqueTags.add(course.category.name);
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

  // 构建课程类别到技术标签的映射 - 优化计算方式，改为返回TagItem
  const categoryToTechTagsMap = useMemo(() => {
    // 如果没有课程数据，返回默认映射
    if (!data?.courses?.length) {
      return { All: DEFAULT_TECH_TAGS };
    }

    // 使用Map减少查找开销
    const mapping: Record<string, TagItem[]> = {};
    const allTechTagsMap = new Map<number, TagItem>();

    // 单次遍历中构建所有映射关系
    data.courses.forEach((course) => {
      let categoryKey =
        course.shortTitleTag ||
        course.category?.name ||
        course.title.split(" ").slice(0, 2).join(" ");

      // 确保"All"分类始终存在
      if (!mapping[categoryKey]) {
        mapping[categoryKey] = [];
      }

      // 添加技术标签
      if (course.tags?.length) {
        course.tags.forEach((tag) => {
          if (tag.id && tag.name) {
            const tagItem: TagItem = { id: tag.id, name: tag.name };

            // 添加到特定分类
            if (!mapping[categoryKey].some((t) => t.id === tag.id)) {
              mapping[categoryKey].push(tagItem);
            }

            // 收集到所有标签集合
            allTechTagsMap.set(tag.id, tagItem);
          }
        });
      }
    });

    // 设置All分类的标签
    mapping["All"] = allTechTagsMap.size
      ? Array.from(allTechTagsMap.values())
      : DEFAULT_TECH_TAGS;

    // 确保每个分类至少有一些标签
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
    return categoryToTechTagsMap[internalTag] || DEFAULT_TECH_TAGS;
  }, [internalTag, categoryToTechTagsMap]);

  // 筛选课程列表 - 优化筛选逻辑
  const filteredCourses = useMemo(() => {
    if (!data?.courses) return [];

    // 筛选逻辑优化
    return data.courses.filter((course) => {
      // 分类筛选
      const matchesCategory =
        internalTag === "All" ||
        course.shortTitleTag === internalTag ||
        course.category?.name === internalTag ||
        course.title.split(" ").slice(0, 2).join(" ") === internalTag;

      if (!matchesCategory) return false;

      // 标签筛选 - 仅在有选中标签时进行，使用ID比较
      if (selectedTagIds.length && course.tags?.length) {
        return selectedTagIds.every((selectedId) =>
          course.tags.some((tag) => tag.id === selectedId)
        );
      }

      return matchesCategory;
    });
  }, [data?.courses, internalTag, selectedTagIds]);

  // 筛选课时列表 - 基于ID的组合查询逻辑
  const filteredLessons = useMemo(() => {
    if (!data?.lessons?.length || !data?.courses?.length) return [];

    // 辅助函数：从任意格式的标签中提取标签ID
    const extractTagIds = (tagData: any): number[] => {
      if (!tagData) return [];

      // 处理 Strapi v5 格式 (data属性)
      if (tagData.data && Array.isArray(tagData.data)) {
        return tagData.data.map((tag: any) => tag.id).filter(Boolean);
      }

      // 处理直接数组
      if (Array.isArray(tagData)) {
        return tagData.map((tag: any) => tag.id).filter(Boolean);
      }

      return [];
    };

    // 确定要筛选的课程ID
    const courseIds =
      internalTag === "All"
        ? data.courses.map((course) => course.id)
        : filteredCourses.map((course) => course.id);

    // 先筛选出属于指定课程的课时
    let filtered = data.lessons.filter(
      (lesson) => lesson.course && courseIds.includes(lesson.course.id)
    );

    // 如果选择了技术标签，进一步筛选
    if (selectedTagIds.length) {
      filtered = filtered.filter((lesson) => {
        // 获取课时和课程的标签ID
        const lessonAny = lesson as any;
        const lessonTagIds = extractTagIds(lessonAny.tags);
        const courseTagIds = lesson.course
          ? extractTagIds(lesson.course.tags)
          : [];

        // 检查课时自身的标签 - 组合查询逻辑(AND)
        if (lessonTagIds.length > 0) {
          // 每个选中的标签ID都必须在课时标签中找到
          const matchesAllTags = selectedTagIds.every((tagId) =>
            lessonTagIds.includes(tagId)
          );

          if (matchesAllTags) {
            return true;
          }
        }

        // 检查所属课程标签 - 组合查询逻辑(AND)
        if (courseTagIds.length > 0) {
          // 每个选中的标签ID都必须在课程标签中找到
          const matchesAllTags = selectedTagIds.every((tagId) =>
            courseTagIds.includes(tagId)
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
    internalTag,
    filteredCourses,
    selectedTagIds,
  ]);

  // 同步外部propCurrentTag变化
  useEffect(() => {
    if (propCurrentTag && propCurrentTag !== internalTag) {
      setInternalTag(propCurrentTag);
      setSelectedTagIds([]);
      setSelectedTagNames([]);
    }
  }, [propCurrentTag, internalTag]);

  // 处理课程分类标签点击 - 优化回调函数
  const handleTagClick = useCallback(
    (tag: string) => {
      if (tag !== internalTag) {
        setInternalTag(tag);
        setSelectedTagIds([]);
        setSelectedTagNames([]);
        setShowTechTags(true);

        if (onTagSelect) {
          onTagSelect(tag);
        }
      }
    },
    [internalTag, onTagSelect]
  );

  // 处理技术标签点击 - 使用ID进行管理
  const handleTechTagClick = useCallback((tagId: number, tagName: string) => {
    setSelectedTagIds((prev) => {
      if (prev.includes(tagId)) {
        // 删除该标签ID
        setSelectedTagNames((currentNames) =>
          currentNames.filter((name) => name !== tagName)
        );
        return prev.filter((id) => id !== tagId);
      }
      // 添加该标签ID
      setSelectedTagNames((currentNames) => [...currentNames, tagName]);
      return [...prev, tagId];
    });
  }, []);

  // 清除所有选中的技术标签 - 优化回调函数
  const clearSelectedTags = useCallback(() => {
    setSelectedTagIds([]);
    setSelectedTagNames([]);
  }, []);

  // 切换技术标签显示 - 优化回调函数
  const toggleTechTags = useCallback(() => {
    setShowTechTags((prev) => !prev);
  }, []);

  // 处理"探索"按钮点击 - 优化回调函数并添加防抖
  const handleExplore = useCallback(() => {
    const tagSection = document.querySelector(
      `.${styles.categorySectionTitle}`
    );
    if (tagSection) {
      const yOffset =
        tagSection.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({ top: yOffset, behavior: "smooth" });
    }
  }, []);

  // 渲染组件 - 优化渲染结构
  return (
    <Flex direction="column" className={styles.container}>
      {/* Banner区域 - 使用memo优化 */}
      <MemoizedBanner handleExplore={handleExplore} />

      {/* 课程分类区域 */}
      <Flex
        direction="column"
        className={styles.categoryArea}
        style={{
          position: "relative",
          zIndex: 5,
          marginTop: "0px",
          marginBottom: "30px",
          width: "100%",
        }}
      >
        {/* 课程分类标题 */}
        <motion.div
          className={styles.categorySectionTitle}
          {...animations.fadeIn}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Text
            as="h2"
            variant="body-strong-l"
            className={styles.categoryTitle}
          >
            Select a lesson
          </Text>
          <div className={styles.flowingLine}></div>
        </motion.div>

        {/* 课程分类标签 - 使用memo优化 */}
        <MemoizedCategoryTags
          tagList={displayTags}
          currentTag={internalTag}
          handleTagClick={handleTagClick}
        />

        {/* 技术标签切换按钮 */}
        <motion.div
          className={styles.techTagsToggle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            variant="secondary"
            size="s"
            onClick={toggleTechTags}
            className={styles.toggleButton}
          >
            {showTechTags ? "Hide" : "Show"}
            {showTechTags ? " ▲" : " ▼"}
          </Button>
        </motion.div>

        {/* 技术标签区域 - 优化AnimatePresence使用 */}
        <AnimatePresence>
          {showTechTags && (
            <MemoizedTechTags
              visible={showTechTags}
              tags={visibleTechTags}
              selectedTagIds={selectedTagIds}
              handleTagClick={handleTechTagClick}
              clearSelectedTags={clearSelectedTags}
            />
          )}
        </AnimatePresence>
      </Flex>

      {/* 内容区域 - 始终展示课时 */}
      <Flex className={styles.coursesSection}>
        <MemoizedCourseDisplay
          loading={isLoading}
          isLoading={isLoading}
          selectedTechTags={selectedTagNames}
          filteredLessons={filteredLessons}
          filteredCourses={[]} // 始终传递空数组，因为不需要显示课程
        />
      </Flex>
    </Flex>
  );
};
