"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Text, Flex, Button } from "@/once-ui/components";
import { useLessonBoxes } from "@/features/home-and-course-preview/context/lessonBoxesContext";
import { Banner } from "../banner";
import { CategoryTags } from "../category-tags";
import { TechTags } from "../tech-tags";
import { LessonDisplay } from "../lesson-display";
import styles from "./index.module.scss";

// 动画变体定义
const animations = {
  fadeIn: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// 内容组件，使用Context
function LessonBoxesContent() {
  const {
    currentTag,
    selectedTagIds,
    selectedTagNames,
    showTechTags,
    displayTags,
    visibleTechTags,
    filteredLessons,
    isLoading,
    handleTagClick,
    handleTechTagClick,
    clearSelectedTags,
    toggleTechTags,
    handleExplore,
  } = useLessonBoxes();

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
        {/* 分类标题 */}
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

        {/* 分类标签 */}
        <CategoryTags
          tagList={displayTags}
          currentTag={currentTag}
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
              selectedTagIds={selectedTagIds}
              handleTagClick={handleTechTagClick}
              clearSelectedTags={clearSelectedTags}
            />
          )}
        </AnimatePresence>
      </Flex>

      {/* 内容区域 - 显示课时 */}
      <Flex className={styles.lessonsSection}>
        <LessonDisplay
          loading={isLoading}
          isLoading={isLoading}
          selectedTechTags={selectedTagNames}
          filteredLessons={filteredLessons}
        />
      </Flex>
    </Flex>
  );
}

// 导出主组件 - 不再直接包含Provider
export const AnimateLessonsBoxes = () => {
  return <LessonBoxesContent />;
};
