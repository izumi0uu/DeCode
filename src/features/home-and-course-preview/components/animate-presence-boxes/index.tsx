import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StackBox } from "../stack-box";

const AnimatePresenceBoxes = () => {
  const [index, setIndex] = useState(0);

  return (
    <motion.div style={{ position: "relative", width: 220, height: 220 }}>
      <AnimatePresence initial={false} mode="sync">
        <StackBox key={index + 1} frontCard={false} />
        <StackBox
          key={index}
          frontCard={true}
          index={index}
          setIndex={setIndex}
          drag="x"
        />
      </AnimatePresence>
    </motion.div>
  );
};

export { AnimatePresenceBoxes };
