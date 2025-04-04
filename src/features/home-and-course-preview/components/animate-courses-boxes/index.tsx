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
    // 默认映射，所有类别都显示所有标签
    const mapping: Record<string, string[]> = {
      All: defaultTechTags,
    };

    // 如果没有API数据，返回默认映射
    if (!data?.courses) return mapping;

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
          if (tag.name && !mapping[categoryKey].includes(tag.name)) {
            mapping[categoryKey].push(tag.name);
          }
        });
      }
    });

    // 确保每个类别至少有一些标签
    Object.keys(mapping).forEach((key) => {
      if (key !== "All" && (!mapping[key] || mapping[key].length === 0)) {
        mapping[key] = defaultTechTags.slice(0, 3);
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

    if (internalTag === "All") {
      return data.courses;
    }

    return data.courses.filter((course) => {
      if (course.shortTitleTag === internalTag) return true;
      if (course.category?.name === internalTag) return true;

      const shortTitle = course.title.split(" ").slice(0, 2).join(" ");
      return shortTitle === internalTag;
    });
  }, [data?.courses, internalTag]);

  // 筛选的课时列表
  const filteredLessons = useMemo(() => {
    if (!data?.lessons || filteredCourses.length === 0) return [];

    const courseIds = filteredCourses.map((course) => course.id);

    // 筛选属于所选课程的课时
    let filtered = data.lessons.filter(
      (lesson) => lesson.course && courseIds.includes(lesson.course.id)
    );

    // 如果选择了技术标签，进一步筛选
    if (selectedTechTags.length > 0) {
      filtered = filtered.filter((lesson) => {
        const lessonWithTags = lesson as LessonLight & { tags?: Array<Tag> };
        return (
          lessonWithTags.tags?.some((tag) =>
            selectedTechTags.includes(tag.name)
          ) || false
        );
      });
    }

    return filtered;
  }, [data?.lessons, filteredCourses, selectedTechTags]);

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
            />
          )}
        </AnimatePresence>
      </Flex>

      {/* 内容区域 */}
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
