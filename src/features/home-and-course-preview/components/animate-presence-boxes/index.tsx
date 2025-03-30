import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StackBox } from "../stack-box";
import { Course } from "@/features/types/api/course";
import { useCourseCarousel } from "@/features/home-and-course-preview/context/courseCarouselContext";

const AnimatePresenceBoxes = () => {
  const { currentIndex, setCurrentIndex, currentCourse, nextCourse } =
    useCourseCarousel();

  return (
    <motion.div style={{ position: "relative", width: 220, height: 220 }}>
      <AnimatePresence initial={false} mode="sync">
        <StackBox
          key={currentIndex + 1}
          frontCard={false}
          course={nextCourse}
        />
        <StackBox
          key={currentIndex}
          frontCard={true}
          index={currentIndex}
          setIndex={setCurrentIndex}
          course={currentCourse}
          drag="x"
        />
      </AnimatePresence>
    </motion.div>
  );
};

export { AnimatePresenceBoxes };
