import { motion } from "framer-motion";
import { Flex, Button, Icon } from "@/once-ui/components";
import React from "react";
import styles from "./index.module.scss";

interface TechTagsProps {
  visible: boolean;
  tags: string[];
  selectedTags: string[];
  handleTagClick: (tag: string) => void;
  clearSelectedTags?: () => void;
}

export const TechTags = ({
  visible,
  tags,
  selectedTags,
  handleTagClick,
  clearSelectedTags,
}: TechTagsProps) => {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={styles.techTagsContainer}
    >
      <Flex className={styles.techTags} wrap>
        {tags.map((tag, index) => (
          <motion.div
            key={tag}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.2,
              delay: 0.1 + index * 0.03,
              ease: "easeOut",
            }}
            whileHover={
              !selectedTags.includes(tag)
                ? { scale: 1.05, y: -2 }
                : { scale: 1 }
            }
            whileTap={{ scale: 0.95 }}
          >
            <Button
              key={tag}
              variant={selectedTags.includes(tag) ? "primary" : "tertiary"}
              size="s"
              onClick={() => handleTagClick(tag)}
              className={`${styles.techTagButton} ${
                selectedTags.includes(tag) ? styles.active : ""
              }`}
            >
              {tag}
            </Button>
          </motion.div>
        ))}

        {selectedTags.length > 0 && clearSelectedTags && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="primary"
              size="s"
              onClick={clearSelectedTags}
              className={styles.clearTagsButton}
              aria-label="Clear all selected tags"
            >
              <Icon name="close" size="xs" color="white" />
            </Button>
          </motion.div>
        )}
      </Flex>
    </motion.div>
  );
};
