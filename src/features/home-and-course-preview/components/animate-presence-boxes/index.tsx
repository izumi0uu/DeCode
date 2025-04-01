import { AnimatePresence } from "framer-motion";
import { StackBox } from "../stack-box";
import { useCourseCarousel } from "../../context/courseCarouselContext";
import { AnimatedTooltip } from "../animate-tooltip";
import { useState, useEffect, useMemo } from "react";
import styles from "./index.module.scss";
import { shuffleArray } from "@/lib/utils/shuffleArray";

export const AnimatePresenceBoxes = () => {
  const { courses, currentIndex, setCurrentIndex } = useCourseCarousel();
  const [showTooltip, setShowTooltip] = useState(false);

  // 当前标签，随机选择4个
  const randomTags = useMemo(() => {
    const tags = courses[currentIndex]?.tags || [];
    return shuffleArray(tags).slice(0, 4);
  }, [courses, currentIndex]);

  useEffect(() => {
    // 当卡片切换时，短暂延迟后显示 tooltip
    setShowTooltip(false); // 先隐藏
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // 确保有课程数据再渲染
  if (!courses.length || currentIndex >= courses.length) {
    return null;
  }

  return (
    <div className={styles.animatePresenceBoxes}>
      <AnimatePresence mode="popLayout">
        <StackBox
          key={`front-${currentIndex}`}
          frontCard
          drag="x"
          index={currentIndex}
          setIndex={setCurrentIndex}
          course={courses[currentIndex]}
        />
        <StackBox
          key={`back-${currentIndex + 1}`}
          index={currentIndex + 1}
          course={courses[currentIndex + 1]}
        />
      </AnimatePresence>
      <div className={styles.tooltipsContainer}>
        {randomTags.map((tag, index) => (
          <AnimatedTooltip
            key={tag.id}
            tag={tag}
            isVisible={showTooltip}
            position="right"
            extraStyles={{
              top: `${index * 100}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
