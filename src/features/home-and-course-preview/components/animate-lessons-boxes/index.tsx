"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Text, Flex, Button } from "@/once-ui/components";
import {
  LessonBoxesProvider,
  useLessonBoxes,
} from "../../context/lessonBoxesContext";
import { Banner } from "./Banner";
import { CategoryTags } from "./CategoryTags";
import { TechTags } from "./TechTags";
import { LessonDisplay } from "./LessonDisplay";
import styles from "./index.module.scss";

// 主组件接口
interface AnimateLessonsBoxesProps {
  tagList?: string[];
  currentTag?: string;
  onTagSelect?: (tag: string) => void;
}

// 动画变体定义
const animations = {
  fadeIn: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// 内部组件，使用Context
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

        {/* 课程分类标签 */}
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

      {/* 内容区域 */}
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

// 包装主组件
export const AnimateLessonsBoxes = (props: AnimateLessonsBoxesProps = {}) => {
  return (
    <LessonBoxesProvider
      initialTag={props.currentTag}
      tagList={props.tagList}
      onTagSelect={props.onTagSelect}
    >
      <LessonBoxesContent />
    </LessonBoxesProvider>
  );
};
