"use client";

import React, { RefObject } from "react";
import { motion } from "framer-motion";
import styles from "./index.module.scss";

interface ScrollToBottomButtonProps {
  containerRef?: RefObject<HTMLElement>;
}

const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({
  containerRef,
}) => {
  const scrollToBottom = () => {
    if (containerRef?.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={styles.buttonContainer}>
      <motion.div
        className={styles.scrollButton}
        onClick={scrollToBottom}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <motion.div
          className={styles.buttonIcon}
          animate={{ y: [0, -3, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          ↓
        </motion.div>
        <motion.div
          className={styles.buttonRing}
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(74, 105, 189, 0)",
              "0 0 0 8px rgba(74, 105, 189, 0.3)",
              "0 0 0 0 rgba(74, 105, 189, 0)",
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
};

export default ScrollToBottomButton;
