import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./index.module.scss";
import { Tag } from "@/features/home-and-course-preview/types";
interface AnimatedTooltipProps {
  tag: Tag;
  isVisible: boolean;
  position?: "left" | "right" | "top" | "bottom";
  extraStyles?: React.CSSProperties;
}

export const AnimatedTooltip = ({
  tag,
  isVisible,
  position = "right",
  extraStyles,
}: AnimatedTooltipProps) => {
  const positionStyles = {
    right: position === "right" ? "-200px" : "auto",
    left: position === "left" ? "-200px" : "auto",
    top: position === "top" ? "-200px" : "auto",
    bottom: position === "bottom" ? "-200px" : "auto",
  };

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
          style={{ ...positionStyles, ...extraStyles }}
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
            <strong>{tag.name}:</strong> {tag.shortDescription}
          </motion.div>
          <div className={styles.arrow} />
        </div>
      )}
    </AnimatePresence>
  );
};
