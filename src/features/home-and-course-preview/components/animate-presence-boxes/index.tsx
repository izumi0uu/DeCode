import { AnimatePresence } from "framer-motion";
import { StackBox } from "../stack-box";
import { useCourseCarousel } from "../../context/courseCarouselContext";
import { AnimatedTooltip } from "../animate-tooltip";
import { useRef, useState, useEffect } from "react";
import styles from "./index.module.scss";

export const AnimatePresenceBoxes = () => {
  const { courses, currentIndex, setCurrentIndex } = useCourseCarousel();
  const frontCardRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // 准备标签描述内容
  const getTagDescriptions = () => {
    const currentCourse = courses[currentIndex];
    if (!currentCourse?.tags?.length) return "暂无标签描述";

    // 将所有标签的shortDescription组合成一个内容列表
    return (
      <div>
        {currentCourse.tags.map((tag) => (
          <div key={tag.id} style={{ marginBottom: "8px" }}>
            <strong>{tag.name}:</strong> {tag.shortDescription}
          </div>
        ))}
      </div>
    );
  };

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
          ref={frontCardRef}
        />
        <StackBox
          key={`back-${currentIndex + 1}`}
          index={currentIndex + 1}
          course={courses[currentIndex + 1]}
        />
      </AnimatePresence>
      <AnimatedTooltip
        boxRef={frontCardRef}
        content={getTagDescriptions()}
        isVisible={showTooltip}
        position="right"
      />
    </div>
  );
};
