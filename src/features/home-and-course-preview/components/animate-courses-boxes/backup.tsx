import { useCallback, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Text, Flex, Button, Background } from "@/once-ui/components";
import { useCoursesAndLessonsForPreview } from "@/features/home-and-course-preview/api/use-get-courses-lessons";
import { CourseCardSkeletons } from "@/features/home-and-course-preview/components/skeletons";
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
  // 课程分类标签 - 基于temp.md中的课程分类
  const courseCategoryTags = [
    "全部", // All courses
    "Web3基础", // Web3 & Blockchain Basics
    "加密货币", // Cryptocurrency Principles
    "以太坊开发", // Ethereum Development
    "数字资产", // Digital Assets & NFTs
    "DeFi", // DeFi & DAO
    "Web3应用", // Web3 Applications
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

  // 如果有外部传入的标签列表，则使用它，否则使用默认的课程分类标签
  const tagList = propTagList || courseCategoryTags;
  const [currentTag, setCurrentTag] = useState(propCurrentTag || "全部");
  const [loading, setLoading] = useState(true);
  const [showTechTags, setShowTechTags] = useState(false);
  const coursesSectionRef = useRef<HTMLDivElement>(null);
  const tagFilterRef = useRef<HTMLDivElement>(null);

  // 获取课程数据
  const { data, isLoading } = useCoursesAndLessonsForPreview();

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

  // 技术标签点击
  const handleTechTagClick = (tag: string) => {
    // 实现技术标签筛选逻辑
    console.log(`Selected tech tag: ${tag}`);
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

  // 显示的课程 - 根据标签筛选
  const filteredCourses = data?.courses || [];

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
          <Text as="h1" className={styles.bannerTitle} variant="body-strong-xl">
            Discover Web3 Education
          </Text>

          <Text
            as="h2"
            className={styles.bannerSubtitle}
            variant="body-strong-l"
          >
            Learn. Build. Innovate.
          </Text>

          <Text
            as="p"
            className={styles.bannerDescription}
            variant="body-default-m"
          >
            Join our community and gain the skills needed to thrive in the
            decentralized future. Explore courses crafted by industry experts.
          </Text>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
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
          zIndex: 2,
          marginTop: "-20px",
          marginBottom: "30px",
          width: "100%",
        }}
      >
        {/* 主要课程分类标签 */}
        {tagList && tagList.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              width: "100%",
              maxWidth: "1000px",
              margin: "0 auto 20px",
              padding: "0 15px",
            }}
          >
            <Background
              position="relative"
              className={styles.tagFilterBackground}
            >
              <Flex className={styles.tagFilter} wrap>
                {tagList.map((tag) => (
                  <motion.div
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={currentTag === tag ? "primary" : "secondary"}
                      size="m"
                      onClick={() => handleTagClick(tag)}
                      className={styles.tagButton}
                    >
                      {tag}
                    </Button>
                  </motion.div>
                ))}
              </Flex>
            </Background>
          </motion.div>
        )}

        {/* 技术标签切换按钮 */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
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
        </div>

        {/* 技术标签区域 - 可折叠 */}
        <AnimatePresence>
          {showTechTags && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                width: "100%",
                maxWidth: "1000px",
                margin: "0 auto 24px",
                padding: "0 15px",
                overflow: "hidden",
              }}
            >
              <Background
                position="relative"
                className={styles.techTagsBackground}
              >
                <Flex className={styles.techTags} wrap>
                  {techTags.map((tag) => (
                    <Button
                      key={tag}
                      variant="tertiary"
                      size="s"
                      onClick={() => handleTechTagClick(tag)}
                      className={styles.techTagButton}
                    >
                      {tag}
                    </Button>
                  ))}
                </Flex>
              </Background>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Courses Section */}
      <Flex
        ref={coursesSectionRef}
        className={styles.coursesSection}
        align="center"
        wrap
      >
        {loading || isLoading ? (
          <CourseCardSkeletons count={3} />
        ) : (
          filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              className={styles.courseCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * course.id }}
            >
              {course.title}
            </motion.div>
          ))
        )}
      </Flex>
    </Flex>
  );
};
