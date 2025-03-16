import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StackBox } from "../stack-box";

const AnimatePresenceStackWrapper = () => {
  const [index, setIndex] = useState(0);
  return (
    <motion.div style={{ position: "relative", width: 150, height: 150 }}>
      <AnimatePresence initial={false}>
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

export { AnimatePresenceStackWrapper };
