import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StackBox } from "../stack-box";

const AnimatePresenceBoxes = () => {
  const [index, setIndex] = useState(0);
  const [exitX, setExitX] = useState(0);

  const handleChange = (newIndex: number, direction: number) => {
    setExitX(direction * 250); // -250 或 250
    setIndex(newIndex);
  };
  return (
    <motion.div style={{ position: "relative", width: 220, height: 220 }}>
      <AnimatePresence initial={false} mode="wait">
        <StackBox key={`back-${index}`} frontCard={false} index={index} />
        <StackBox
          key={`front-${index}`}
          frontCard={true}
          index={index}
          setIndex={(newIndex) =>
            handleChange(newIndex, newIndex > index ? -1 : 1)
          }
          drag="x"
        />
      </AnimatePresence>
    </motion.div>
  );
};

export { AnimatePresenceBoxes };
