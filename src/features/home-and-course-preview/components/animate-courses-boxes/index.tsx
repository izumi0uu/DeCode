import { useCallback, useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Text, Flex, Button, Background } from "@/once-ui/components";
import { useCoursesAndLessonsForPreview } from "@/features/home-and-course-preview/api/use-get-courses-lessons";
import { CourseCardSkeletons } from "@/features/home-and-course-preview/components/skeletons";
import { LessonLight } from "@/features/types/api/lesson";
import { Tag } from "@/features/types/api/tag";
import styles from "./index.module.scss";

interface AnimateCoursesBoxesProps {
  tagList?: string[];
  currentTag?: string;
  onTagSelect?: (tag: string) => void;
}

export const AnimateCoursesBoxes = ({
  tagList: propTagList,
  currentTag: propCurrentTag,
  onTagSelect,
}: AnimateCoursesBoxesProps = {}) => {
  // 英文课程分类标签 - 从API动态提取
  const defaultCourseCategoryTags = [
    "All", // All courses
    "Web3 Basics", // Web3 & Blockchain Basics
    "Cryptocurrency", // Cryptocurrency Principles
    "Ethereum Development", // Ethereum Development
    "Digital Assets", // Digital Assets & NFTs
    "DeFi", // DeFi & DAO
    "Web3 Applications", // Web3 Applications
  ];

  // 技术标签
  const techTags = [
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

  // 从API数据中提取课程分类标签
  const apiCourseCategoryTags = useMemo(() => {
    if (!data?.courses || data.courses.length === 0) {
      return defaultCourseCategoryTags;
    }

    // 首先添加"All"选项
    const categoryTags = ["All"];

    // 提取课程的shortTitleTag（如果存在）或使用课程类别
    const uniqueTags = new Set<string>();
    data.courses.forEach((course) => {
      // 如果有shortTitleTag属性，优先使用
      if (course.shortTitleTag) {
        uniqueTags.add(course.shortTitleTag);
      }
      // 否则尝试使用category
      else if (course.category?.name) {
        uniqueTags.add(course.category.name);
      }
      // 如果都没有，可以使用title的简化版本
      else {
        const shortTitle = course.title.split(" ").slice(0, 2).join(" ");
        uniqueTags.add(shortTitle);
      }
    });

    // 将独特的标签添加到结果中
    categoryTags.push(...Array.from(uniqueTags));
    return categoryTags;
  }, [data?.courses]);

  // 使用API提取的标签或提供的标签列表，否则使用默认的
  const tagList = propTagList || apiCourseCategoryTags;
  const [currentTag, setCurrentTag] = useState(propCurrentTag || "All");
  const [selectedTechTags, setSelectedTechTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTechTags, setShowTechTags] = useState(false);
  const coursesSectionRef = useRef<HTMLDivElement>(null);
  const tagFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 如果外部传入的currentTag变化，则更新内部状态
    if (propCurrentTag && propCurrentTag !== currentTag) {
      setCurrentTag(propCurrentTag);
    }
  }, [propCurrentTag, currentTag]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleExplore = useCallback(() => {
    if (tagFilterRef.current) {
      const yOffset =
        tagFilterRef.current.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({
        top: yOffset,
        behavior: "smooth",
      });
    }
  }, []);

  // 处理课程分类标签点击
  const handleTagClick = (tag: string) => {
    setCurrentTag(tag);
    if (onTagSelect) {
      onTagSelect(tag);
    }

    // 滚动到课程部分
    if (coursesSectionRef.current) {
      const yOffset =
        coursesSectionRef.current.getBoundingClientRect().top +
        window.scrollY -
        100;
      window.scrollTo({
        top: yOffset,
        behavior: "smooth",
      });
    }
  };

  // 技术标签点击 - 支持多选
  const handleTechTagClick = (tag: string) => {
    setSelectedTechTags((prev) => {
      // 如果标签已选中，则移除它
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      // 否则添加它
      return [...prev, tag];
    });
  };

  // 切换显示技术标签
  const toggleTechTags = () => {
    setShowTechTags((prev) => !prev);
  };

  // 预定义光点位置和大小
  const dotPositions = [
    { width: "20px", height: "20px", left: "15%", top: "20%", delay: "0.2s" },
    { width: "16px", height: "16px", left: "35%", top: "45%", delay: "0.5s" },
    { width: "22px", height: "22px", left: "55%", top: "15%", delay: "0.3s" },
    { width: "18px", height: "18px", left: "75%", top: "35%", delay: "0.8s" },
    { width: "24px", height: "24px", left: "25%", top: "70%", delay: "0.6s" },
  ];

  // 筛选课程 - 根据标签筛选
  const filteredCourses = useMemo(() => {
    if (!data?.courses) return [];

    if (currentTag === "All") {
      return data.courses;
    }

    return data.courses.filter((course) => {
      // 根据shortTitleTag筛选
      if (course.shortTitleTag === currentTag) {
        return true;
      }
      // 或者根据category筛选
      if (course.category?.name === currentTag) {
        return true;
      }
      // 或者根据title简化版本筛选
      const shortTitle = course.title.split(" ").slice(0, 2).join(" ");
      return shortTitle === currentTag;
    });
  }, [data?.courses, currentTag]);

  // 筛选课时 - 根据所选课程和技术标签筛选
  const filteredLessons = useMemo(() => {
    if (!data?.lessons || filteredCourses.length === 0) return [];

    const courseIds = filteredCourses.map((course) => course.id);

    // 首先筛选属于所选课程的课时
    let lessonResults = data.lessons.filter(
      (lesson) => lesson.course && courseIds.includes(lesson.course.id)
    );

    // 由于LessonLight可能没有tags属性，先暂时不进行技术标签筛选
    // 实际应用中可能需要扩展LessonLight类型或通过API获取完整数据
    if (selectedTechTags.length > 0) {
      // 假设lesson上有一个关联的tags属性，实际使用时需要更新类型定义或API
      lessonResults = lessonResults.filter((lesson) => {
        // 这里使用类型断言处理当前的类型问题
        const lessonWithTags = lesson as LessonLight & { tags?: Array<Tag> };
        return (
          lessonWithTags.tags?.some((tag) =>
            selectedTechTags.includes(tag.name)
          ) || false
        );
      });
    }

    return lessonResults;
  }, [data?.lessons, filteredCourses, selectedTechTags]);

  return (
    <Flex direction="column" className={styles.container}>
      {/* Banner Section */}
      <div className={styles.banner}>
        <div className={styles.bannerBackground}>
          <div className={styles.glow}></div>
          <div className={styles.decorations}>
            {dotPositions.map((dot, i) => (
              <div
                key={i}
                className={styles.dot}
                style={{
                  width: dot.width,
                  height: dot.height,
                  left: dot.left,
                  top: dot.top,
                  animationDelay: dot.delay,
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className={styles.bannerContent}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Text
              as="h1"
              className={styles.bannerTitle}
              variant="body-strong-xl"
            >
              Discover Web3 Education
            </Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <Text
              as="h2"
              className={styles.bannerSubtitle}
              variant="body-strong-l"
            >
              Learn. Build. Innovate.
            </Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          >
            <Text
              as="p"
              className={styles.bannerDescription}
              variant="body-default-m"
            >
              Join our community and gain the skills needed to thrive in the
              decentralized future. Explore courses crafted by industry experts.
            </Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <Button
              variant="primary"
              size="m"
              onClick={handleExplore}
              className={styles.exploreButton}
            >
              Start exploring
            </Button>
          </motion.div>
        </div>
      </div>

      {/* 课程分类区域 */}
      <div
        ref={tagFilterRef}
        style={{
          position: "relative",
          zIndex: 5, // 提高z-index确保显示在最前
          marginTop: "0px", // 调整顶部间距与banner保持适当距离
          marginBottom: "30px",
          width: "100%",
        }}
      >
        {/* 课程分类标题和流光线 */}
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
            课程选择
          </Text>
          <div className={styles.flowingLine}></div>
        </motion.div>

        {/* 主要课程分类标签 */}
        {tagList && tagList.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
            className={styles.tagFilterContainer}
          >
            <Flex className={styles.tagFilter} wrap>
              {tagList.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.1 + index * 0.05,
                    ease: "easeOut",
                  }}
                  whileHover={
                    currentTag !== tag ? { scale: 1.05, y: -3 } : { scale: 1 }
                  }
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={currentTag === tag ? "primary" : "secondary"}
                    size="m"
                    onClick={() => handleTagClick(tag)}
                    className={`${styles.tagButton} ${
                      currentTag === tag ? styles.active : ""
                    }`}
                  >
                    {tag}
                  </Button>
                </motion.div>
              ))}
            </Flex>
          </motion.div>
        )}

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
            {showTechTags ? "收起技术标签" : "展开技术标签"}
            {showTechTags ? " ▲" : " ▼"}
          </Button>
        </motion.div>

        {/* 技术标签区域 - 可折叠 */}
        <AnimatePresence>
          {showTechTags && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className={styles.techTagsContainer}
            >
              <Flex className={styles.techTags} wrap>
                {techTags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: 0.1 + index * 0.03,
                      ease: "easeOut",
                    }}
                    whileHover={
                      !selectedTechTags.includes(tag)
                        ? { scale: 1.05, y: -2 }
                        : { scale: 1 }
                    }
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      key={tag}
                      variant={
                        selectedTechTags.includes(tag) ? "primary" : "tertiary"
                      }
                      size="s"
                      onClick={() => handleTechTagClick(tag)}
                      className={`${styles.techTagButton} ${
                        selectedTechTags.includes(tag) ? styles.active : ""
                      }`}
                    >
                      {tag}
                    </Button>
                  </motion.div>
                ))}
              </Flex>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Section - 显示课程或课时 */}
      <Flex ref={coursesSectionRef} className={styles.coursesSection}>
        {loading || isLoading ? (
          <CourseCardSkeletons count={3} />
        ) : selectedTechTags.length > 0 ? (
          // 如果选择了技术标签，显示筛选后的课时
          filteredLessons.length > 0 ? (
            filteredLessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                className={styles.courseCard}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 + index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.25)",
                  borderColor: "rgba(102, 126, 234, 0.4)",
                }}
              >
                {lesson.title}
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={styles.noContentMessage}
            >
              <Text variant="body-default-m">
                没有找到符合筛选条件的课程。请尝试其他标签组合。
              </Text>
            </motion.div>
          )
        ) : (
          // 否则显示筛选后的课程
          filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              className={styles.courseCard}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.1 + index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{
                y: -10,
                boxShadow: "0 15px 35px rgba(0, 0, 0, 0.25)",
                borderColor: "rgba(102, 126, 234, 0.4)",
              }}
            >
              {course.title}
            </motion.div>
          ))
        )}
      </Flex>
    </Flex>
  );
};
