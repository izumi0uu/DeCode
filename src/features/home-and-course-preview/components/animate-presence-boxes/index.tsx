import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StackBox } from "../stack-box";
import { useCourseCarousel } from "@/features/home-and-course-preview/context/courseCarouselContext";

const AnimatePresenceBoxes = () => {
  const { currentIndex, setCurrentIndex, currentCourse, nextCourse } =
    useCourseCarousel();

  const cardWidth = 300;
  const cardHeight = 360;

  const containerWidth = useMemo(() => cardWidth + 50, []);
  const containerHeight = useMemo(() => cardHeight + 50, []);

  return (
    <motion.div
      style={{
        position: "relative",
        width: containerWidth,
        height: containerHeight,
        perspective: "1000px",
      }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {nextCourse && (
          <StackBox
            key={`next-${currentIndex}-${nextCourse.id}`}
            frontCard={false}
            course={nextCourse}
          />
        )}
        {currentCourse && (
          <StackBox
            key={`current-${currentIndex}-${currentCourse.id}`}
            frontCard={true}
            index={currentIndex}
            setIndex={setCurrentIndex}
            course={currentCourse}
            drag="x"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export { AnimatePresenceBoxes };
