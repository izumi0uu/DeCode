import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFloating, offset, flip, shift, arrow } from "@floating-ui/react";
import styles from "./index.module.scss";

interface AnimatedTooltipProps {
  boxRef: React.RefObject<HTMLDivElement | null>;
  content: React.ReactNode;
  isVisible: boolean;
  position?: "left" | "right" | "top" | "bottom";
}

export const AnimatedTooltip = ({
  boxRef,
  content,
  isVisible,
  position = "right",
}: AnimatedTooltipProps) => {
  const arrowRef = useRef(null);

  const { refs, floatingStyles, middlewareData } = useFloating({
    elements: {
      reference: boxRef.current,
    },
    placement: position,
    middleware: [offset(10), flip(), shift(), arrow({ element: arrowRef })],
  });

  // 线条动画变体
  const lineVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: "100%",
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      width: 0,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  // 内容动画变体
  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { delay: 0.3, duration: 0.4 },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className={styles.tooltipContainer}
        >
          <motion.div
            className={styles.line}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
          <motion.div
            className={styles.content}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {content}
          </motion.div>
          <div
            ref={arrowRef}
            className={styles.arrow}
            style={{
              left: middlewareData.arrow?.x ?? "",
              top: middlewareData.arrow?.y ?? "",
            }}
          />
        </div>
      )}
    </AnimatePresence>
  );
};
