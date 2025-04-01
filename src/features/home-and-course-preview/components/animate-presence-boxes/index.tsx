import { AnimatePresence } from "framer-motion";
import { StackBox } from "../stack-box";
import { useCourseCarousel } from "../../context/courseCarouselContext";
import { AnimatedTooltip } from "../animate-tooltip";
import { useState, useEffect } from "react";
import styles from "./index.module.scss";

export const AnimatePresenceBoxes = () => {
  const { courses, currentIndex, setCurrentIndex } = useCourseCarousel();
  const [showTooltip, setShowTooltip] = useState(false);

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
        {courses[currentIndex]?.tags?.map((tag, index) => (
          <AnimatedTooltip
            key={tag.id}
            tag={tag}
            isVisible={showTooltip}
            position="right"
            extraStyles={{
              top: `${index * 50}px`, // 每个tooltip垂直间隔40px
            }}
          />
        ))}
      </div>
    </div>
  );
};
