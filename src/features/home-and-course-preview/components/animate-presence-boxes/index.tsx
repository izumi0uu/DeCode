import { AnimatePresence } from "framer-motion";
import { StackBox } from "../stack-box";
import { useCourseCarousel } from "../../context/courseCarouselContext";
import styles from "./index.module.scss";

export const AnimatePresenceBoxes = () => {
  const { courses, currentIndex, setCurrentIndex } = useCourseCarousel();

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
    </div>
  );
};
