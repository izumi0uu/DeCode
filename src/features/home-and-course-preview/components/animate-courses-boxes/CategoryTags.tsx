import { motion } from "framer-motion";
import { Flex, Button } from "@/once-ui/components";
import styles from "./index.module.scss";

interface CategoryTagsProps {
  tagList: string[];
  currentTag: string;
  handleTagClick: (tag: string) => void;
}

export const CategoryTags = ({
  tagList,
  currentTag,
  handleTagClick,
}: CategoryTagsProps) => {
  if (!tagList || tagList.length <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
      className={styles.tagFilterContainer}
    >
      <Flex className={styles.tagFilter} wrap>
        {tagList.map((tag, index) => (
          <motion.div
            key={tag}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.1 + index * 0.05,
              ease: "easeOut",
            }}
            whileHover={
              currentTag !== tag ? { scale: 1.05, y: -3 } : { scale: 1 }
            }
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={currentTag === tag ? "primary" : "secondary"}
              size="m"
              onClick={() => handleTagClick(tag)}
              className={`${styles.tagButton} ${
                currentTag === tag ? styles.active : ""
              }`}
            >
              {tag}
            </Button>
          </motion.div>
        ))}
      </Flex>
    </motion.div>
  );
};
