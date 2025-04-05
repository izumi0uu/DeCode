import { memo, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Flex, Button, Icon } from "@/once-ui/components";
import styles from "./index.module.scss";

const containerVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  hover: { scale: 1.05, y: -2 },
  selected: { scale: 1 },
  tap: { scale: 0.95 },
};

// 标签项接口
export interface TagItem {
  id: number;
  name: string;
}

// 优化清除按钮组件
const ClearButton = memo(
  ({ onClick, visible }: { onClick: () => void; visible: boolean }) => {
    if (!visible) return null;

    return (
      <Button
        variant="primary"
        size="s"
        onClick={onClick}
        aria-label="Clear selected tags"
        className={styles.clearTagsButton}
      >
        <Icon name="close" color="white" size="s" />
      </Button>
    );
  }
);

// 单个标签按钮组件
const TagButton = memo(
  ({
    tag,
    isSelected,
    index,
    onClick,
  }: {
    tag: TagItem;
    isSelected: boolean;
    index: number;
    onClick: (tagId: number, tagName: string) => void;
  }) => {
    // 使用回调避免闭包问题
    const handleClick = useCallback(() => {
      onClick(tag.id, tag.name);
    }, [onClick, tag]);

    // 动画延迟，营造交错效果
    const animationDelay = 0.1 + index * 0.03;

    return (
      <motion.div
        key={tag.id}
        initial="hidden"
        animate="visible"
        transition={{
          duration: 0.2,
          delay: animationDelay,
          ease: "easeOut",
        }}
        variants={tagVariants}
        whileHover={!isSelected ? "hover" : "selected"}
        whileTap="tap"
      >
        <Button
          variant={isSelected ? "primary" : "tertiary"}
          size="s"
          onClick={handleClick}
          className={`${styles.techTagButton} ${
            isSelected ? styles.active : ""
          }`}
        >
          {tag.name}
        </Button>
      </motion.div>
    );
  }
);

// 主组件
interface TechTagsProps {
  visible: boolean;
  tags: TagItem[];
  selectedTagIds: number[];
  handleTagClick: (tagId: number, tagName: string) => void;
  clearSelectedTags: () => void;
}

const TechTags = ({
  visible,
  tags,
  selectedTagIds,
  handleTagClick,
  clearSelectedTags,
}: TechTagsProps) => {
  // 计算是否显示清除按钮
  const showClearButton = useMemo(
    () => selectedTagIds.length > 0,
    [selectedTagIds.length]
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={styles.techTagsContainer}
    >
      <Flex
        className={styles.techTags}
        wrap
        style={{ justifyContent: "flex-start", alignItems: "center" }}
      >
        {/* 标签列表 */}
        {tags.map((tag, index) => (
          <TagButton
            key={tag.id}
            tag={tag}
            isSelected={selectedTagIds.includes(tag.id)}
            index={index}
            onClick={handleTagClick}
          />
        ))}

        {/* 清除按钮 */}
        <ClearButton onClick={clearSelectedTags} visible={showClearButton} />
      </Flex>
    </motion.div>
  );
};

export default memo(TechTags);
export { TechTags };
