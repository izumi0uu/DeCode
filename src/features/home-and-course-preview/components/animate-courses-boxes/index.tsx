import { useCallback, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Text, Flex, Button } from "@/once-ui/components";
import { useCoursesAndLessonsForPreview } from "@/features/home-and-course-preview/api/use-get-courses-lessons";
import { LessonLight } from "@/features/types/api/lesson";
import { Tag } from "@/features/types/api/tag";
import { Course } from "@/features/types/api/course";
import { Banner } from "./Banner";
import { CategoryTags } from "./CategoryTags";
import { TechTags } from "./TechTags";
import { CourseDisplay } from "./CourseDisplay";
import styles from "./index.module.scss";

// 主组件接口
interface AnimateCoursesBoxesProps {
  tagList?: string[];
  currentTag?: string;
  onTagSelect?: (tag: string) => void;
}

export const AnimateCoursesBoxes = (props: AnimateCoursesBoxesProps = {}) => {
  // 解构属性
  const {
    tagList: propTagList,
    currentTag: propCurrentTag,
    onTagSelect,
  } = props;

  // 默认标签列表
  const defaultCourseCategoryTags = [
    "All",
    "Web3 Basics",
    "Cryptocurrency",
    "Ethereum Development",
    "Digital Assets",
    "DeFi",
    "Web3 Applications",
  ];

  // 预定义的技术标签
  const defaultTechTags = [
    "Web3",
    "Blockchain",
    "Web3 Infrastructure",
    "Web3 Development",
    "Consensus Mechanism",
    "Wallet Security",
    "DApp",
    "Cryptocurrency",
    "Ethereum",
    "Smart Contract",
    "NFT",
  ];

  // 获取课程数据
  const { data, isLoading } = useCoursesAndLessonsForPreview();

  // 组件状态
  const [internalTag, setInternalTag] = useState(propCurrentTag || "All");
  const [selectedTechTags, setSelectedTechTags] = useState<string[]>([]);
  const [showTechTags, setShowTechTags] = useState(false);
  const [loading, setLoading] = useState(isLoading);

  // 从API中提取课程分类标签
  const apiTags = useMemo(() => {
    if (!data?.courses || data.courses.length === 0) {
      return defaultCourseCategoryTags;
    }

    const uniqueTags = new Set(["All"]);

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
  const displayTags = useMemo(() => {
    return propTagList || apiTags;
  }, [propTagList, apiTags]);

  // 构建课程类别到技术标签的映射
  const categoryToTechTagsMap = useMemo(() => {
    // 默认空映射
    const mapping: Record<string, string[]> = {};

    // 如果没有API数据，使用默认标签
    if (!data?.courses || data.courses.length === 0) {
      mapping["All"] = defaultTechTags;
      return mapping;
    }

    // 收集所有课程的技术标签
    const allTechTags = new Set<string>();

    // 处理每个课程
    data.courses.forEach((course) => {
      let categoryKey = "All";

      // 确定课程类别
      if (course.shortTitleTag) {
        categoryKey = course.shortTitleTag;
      } else if (course.category?.name) {
        categoryKey = course.category.name;
      } else {
        categoryKey = course.title.split(" ").slice(0, 2).join(" ");
      }

      // 初始化类别映射
      if (!mapping[categoryKey]) {
        mapping[categoryKey] = [];
      }

      // 添加技术标签
      if (course.tags && course.tags.length > 0) {
        course.tags.forEach((tag) => {
          if (tag.name) {
            // 添加到特定分类
            if (!mapping[categoryKey].includes(tag.name)) {
              mapping[categoryKey].push(tag.name);
            }

            // 同时收集到所有标签集合
            allTechTags.add(tag.name);
          }
        });
      }
    });

    // 设置All分类的标签为所有收集到的标签
    mapping["All"] = Array.from(allTechTags);

    // 如果All分类没有标签，使用默认标签
    if (mapping["All"].length === 0) {
      mapping["All"] = defaultTechTags;
    }

    // 确保每个类别至少有一些标签
    Object.keys(mapping).forEach((key) => {
      if (key !== "All" && (!mapping[key] || mapping[key].length === 0)) {
        // 如果没有标签，使用全局标签的子集
        mapping[key] = mapping["All"].slice(
          0,
          Math.min(3, mapping["All"].length)
        );
      }
    });

    return mapping;
  }, [data?.courses, defaultTechTags]);

  // 当前类别的可见技术标签
  const visibleTechTags = useMemo(() => {
    return categoryToTechTagsMap[internalTag] || defaultTechTags;
  }, [internalTag, categoryToTechTagsMap, defaultTechTags]);

  // 筛选的课程列表
  const filteredCourses = useMemo(() => {
    if (!data?.courses) return [];

    // 如果是All标签，返回所有课程
    if (internalTag === "All") {
      // 如果选择了技术标签，进行组合筛选（必须同时包含所有选中的标签）
      if (selectedTechTags.length > 0) {
        return data.courses.filter((course) => {
          if (!course.tags || course.tags.length === 0) return false;

          // 检查课程是否包含所有选定的标签
          return selectedTechTags.every((selectedTag) =>
            course.tags.some((tag) => tag.name === selectedTag)
          );
        });
      }
      // 否则返回所有课程
      return data.courses;
    }

    // 首先基于课程分类筛选
    let filtered = data.courses.filter((course) => {
      if (course.shortTitleTag === internalTag) return true;
      if (course.category?.name === internalTag) return true;

      const shortTitle = course.title.split(" ").slice(0, 2).join(" ");
      return shortTitle === internalTag;
    });

    // 如果选择了技术标签，进行组合筛选
    if (selectedTechTags.length > 0) {
      filtered = filtered.filter((course) => {
        if (!course.tags || course.tags.length === 0) return false;

        // 检查课程是否包含所有选定的标签
        return selectedTechTags.every((selectedTag) =>
          course.tags.some((tag) => tag.name === selectedTag)
        );
      });
    }

    return filtered;
  }, [data?.courses, internalTag, selectedTechTags]);

  // 获取所有课时
  const allLessons = useMemo(() => {
    return data?.lessons || [];
  }, [data?.lessons]);

  // 根据选中课程筛选课时
  const filteredLessons = useMemo(() => {
    if (!allLessons.length || !data?.courses) return [];

    // 如果是All标签且没有选择技术标签，显示所有课时
    if (internalTag === "All" && selectedTechTags.length === 0) {
      return allLessons;
    }

    // 如果选择了特定分类
    let courseIds: Array<string | number> = [];

    // 根据课程分类筛选课程ID
    if (internalTag !== "All") {
      courseIds = data.courses
        .filter((course) => {
          if (course.shortTitleTag === internalTag) return true;
          if (course.category?.name === internalTag) return true;

          const shortTitle = course.title.split(" ").slice(0, 2).join(" ");
          return shortTitle === internalTag;
        })
        .map((course) => course.id);
    } else {
      // 对于All分类，使用所有课程
      courseIds = data.courses.map((course) => course.id);
    }

    // 筛选属于这些课程的课时
    let filtered = allLessons.filter(
      (lesson) => lesson.course && courseIds.includes(lesson.course.id)
    );

    // 如果选择了技术标签，进行组合筛选
    if (selectedTechTags.length > 0) {
      filtered = filtered.filter((lesson) => {
        // 类型转换以处理课时标签
        const lessonWithTags = lesson as LessonLight & { tags?: Array<Tag> };

        // 检查课时标签
        if (lessonWithTags.tags && lessonWithTags.tags.length > 0) {
          // 必须包含所有选中的标签
          const hasTags = selectedTechTags.every((selectedTag) => {
            return lessonWithTags.tags!.some((tag) => tag.name === selectedTag);
          });
          if (hasTags) return true;
        }

        // 检查所属课程标签
        if (
          lesson.course &&
          lesson.course.tags &&
          lesson.course.tags.length > 0
        ) {
          // 必须包含所有选中的标签
          return selectedTechTags.every((selectedTag) =>
            lesson.course!.tags!.some((tag) => tag.name === selectedTag)
          );
        }

        return false;
      });
    }

    return filtered;
  }, [allLessons, data?.courses, internalTag, selectedTechTags]);

  // 同步外部propCurrentTag变化
  useEffect(() => {
    if (propCurrentTag && propCurrentTag !== internalTag) {
      setInternalTag(propCurrentTag);
      setSelectedTechTags([]);
    }
  }, [propCurrentTag]);

  // 处理加载状态
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  // 处理课程分类标签点击
  const handleTagClick = useCallback(
    (tag: string) => {
      if (tag !== internalTag) {
        setInternalTag(tag);
        setSelectedTechTags([]);
        setShowTechTags(true);

        if (onTagSelect) {
          onTagSelect(tag);
        }
      }
    },
    [internalTag, onTagSelect]
  );

  // 处理技术标签点击
  const handleTechTagClick = useCallback((tag: string) => {
    setSelectedTechTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      return [...prev, tag];
    });
  }, []);

  // 清除所有选中的技术标签
  const clearSelectedTags = useCallback(() => {
    setSelectedTechTags([]);
  }, []);

  // 切换技术标签显示
  const toggleTechTags = useCallback(() => {
    setShowTechTags((prev) => !prev);
  }, []);

  // 处理"探索"按钮点击
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

  // 渲染组件
  return (
    <Flex direction="column" className={styles.container}>
      {/* Banner区域 */}
      <Banner handleExplore={handleExplore} />

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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Text
            as="h2"
            variant="body-strong-l"
            className={styles.categoryTitle}
          >
            Select a course
          </Text>
          <div className={styles.flowingLine}></div>
        </motion.div>

        {/* 课程分类标签 */}
        <CategoryTags
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

        {/* 技术标签区域 */}
        <AnimatePresence>
          {showTechTags && (
            <TechTags
              visible={showTechTags}
              tags={visibleTechTags}
              selectedTags={selectedTechTags}
              handleTagClick={handleTechTagClick}
              clearSelectedTags={clearSelectedTags}
            />
          )}
        </AnimatePresence>
      </Flex>

      {/* 内容区域 - 展示课程和课时 */}
      <Flex className={styles.coursesSection}>
        <CourseDisplay
          loading={loading}
          isLoading={isLoading}
          selectedTechTags={selectedTechTags}
          filteredLessons={filteredLessons}
          filteredCourses={filteredCourses}
        />
      </Flex>
    </Flex>
  );
};
