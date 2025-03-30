import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StackBox } from "../stack-box";
import { Course } from "@/features/types/api/course";

const AnimatePresenceBoxes = ({
  popularCourses,
}: {
  popularCourses?: Course[];
}) => {
  const [index, setIndex] = useState(0);

  return (
    <motion.div style={{ position: "relative", width: 220, height: 220 }}>
      <AnimatePresence initial={false} mode="sync">
        <StackBox
          key={index + 1}
          frontCard={false}
          popularCourses={popularCourses?.[index + 1]}
        />
        <StackBox
          key={index}
          frontCard={true}
          index={index}
          setIndex={setIndex}
          drag="x"
          popularCourses={popularCourses?.[index]}
        />
      </AnimatePresence>
    </motion.div>
  );
};

export { AnimatePresenceBoxes };
