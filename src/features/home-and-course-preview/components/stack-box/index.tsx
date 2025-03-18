import { useTransform, useMotionValue, motion } from "framer-motion";
import { useState } from "react";

const StackBox = ({
  frontCard,
  drag,
  index,
  setIndex,
}: {
  frontCard?: boolean;
  drag?: "x" | "y";
  index?: number;
  setIndex?: (index: number) => void;
}) => {
  const [exitX, setExitX] = useState(0);

  const x = useMotionValue(0);
  const scale = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  const rotate = useTransform(x, [-150, 0, 150], [-45, 0, 45], {
    clamp: false,
  });

  const variantsFrontCard = {
    animate: { scale: 1, y: 0, opacity: 1 },
    exit: (custom: number) => ({ x: custom, opacity: 0, scale: 0.5 }),
  };

  const variantsBackCard = {
    initial: { scale: 0, y: 105, opacity: 0 },
    animate: { scale: 0.75, y: 40, opacity: 0.5 },
  };

  const handleDragEnd = (_: any, info: any) => {
    if (!setIndex || index === undefined) return;

    if (info.offset.x < -100) {
      setExitX(-250);
      setIndex?.(index + 1);
    }
    if (info.offset.x > 100) {
      setExitX(250);
      setIndex?.(index + 1);
    }
  };

  return (
    <motion.div
      style={{
        width: 220,
        height: 220,
        position: "absolute",
        x,
        rotate,
      }}
      whileTap={{ cursor: "grabbing" }}
      drag={drag}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      variants={frontCard ? variantsFrontCard : variantsBackCard}
      initial="initial"
      animate="animate"
      exit="exit"
      custom={exitX}
      transition={
        frontCard
          ? { type: "spring", stiffness: 300, damping: 20 }
          : { scale: { duration: 0.2 }, opacity: { duration: 0.4 } }
      }
    >
      <motion.div
        style={{
          width: 220,
          height: 220,
          backgroundColor: "#fff",
          borderRadius: 30,
          scale,
        }}
      />
    </motion.div>
  );
};

export { StackBox };
