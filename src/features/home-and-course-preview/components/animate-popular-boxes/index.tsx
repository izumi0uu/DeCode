import { AnimatePresence } from "framer-motion";
import { Suspense } from "react";
import { StackBox } from "../stack-box";
import { useCourseCarousel } from "../../context/courseCarouselContext";
import { AnimatedTooltip } from "../animate-tooltip";
import styles from "./index.module.scss";
import {
  TagCarouselProvider,
  useTagCarousel,
} from "../../context/tagCarouselContext";
import { CoursePopularCardSkeletons } from "../skeletons";

// 内部组件，使用 TagCarouselContext
const AnimatePopularBoxesInner = () => {
  const { courses, currentIndex, setCurrentIndex } = useCourseCarousel();
  const { randomTags, isTooltipVisible, refreshTags } = useTagCarousel();

  return (
    <div className={styles.animatePopularBoxes}>
      <Suspense fallback={<CoursePopularCardSkeletons count={2} />}>
        <AnimatePresence mode="popLayout">
          <StackBox
            key={`front-${currentIndex}`}
            frontCard
            drag="x"
            index={currentIndex}
            setIndex={setCurrentIndex}
            course={courses[currentIndex]}
            randomTags={randomTags}
            onRefreshTags={refreshTags}
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
              isVisible={isTooltipVisible}
              position="right"
              extraStyles={{
                top: `${index * 100}px`,
              }}
            />
          ))}
        </div>
      </Suspense>
    </div>
  );
};

// 导出组件，提供 TagCarouselContext
export const AnimatePopularBoxes = () => {
  return (
    <TagCarouselProvider maxTags={4} defaultInterval={30000}>
      <AnimatePopularBoxesInner />
    </TagCarouselProvider>
  );
};
