import { Course } from "@/features/types/api/course";
import { Tag } from "@/features/types";
import {
  useTransform,
  useMotionValue,
  motion,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Text } from "@/once-ui/components";
import styles from "./index.module.scss";

interface StackBoxProps {
  frontCard?: boolean;
  drag?: "x" | "y";
  index?: number;
  setIndex?: (index: number) => void;
  course?: Course;
  randomTags?: Tag[];
  onRefreshTags?: () => void;
}

export const StackBox = ({
  frontCard,
  drag,
  index,
  setIndex,
  course,
  randomTags,
  onRefreshTags,
}: StackBoxProps) => {
  const [exitX, setExitX] = useState(0);
  const [tagsKey, setTagsKey] = useState(0);

  // 卡片尺寸增大
  const cardWidth = 300;
  const cardHeight = 360;

  const x = useMotionValue(0);
  const scale = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  const rotate = useTransform(x, [-150, 0, 150], [-45, 0, 45], {
    clamp: false,
  });

  const variantsFrontCard = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, y: 0, opacity: 1, zIndex: 10 },
    exit: (custom: number) => ({
      x: custom,
      opacity: 0,
      scale: 0.5,
      transition: { duration: 0.3 },
    }),
  };

  const variantsBackCard = {
    initial: { scale: 0.6, y: 50, opacity: 0, zIndex: 1 },
    animate: { scale: 0.8, y: 50, opacity: 0.7, zIndex: 1 },
    exit: { opacity: 0, scale: 1, transition: { duration: 0.2 } },
  };

  const tagsContainerVariants = {
    enter: { x: -30, opacity: 0 },
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      x: 30,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const refreshButtonVariants = {
    idle: { rotate: 0 },
    refreshing: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      },
    },
  };

  const handleDragEnd = (_: any, info: any) => {
    if (!setIndex || index === undefined) return;

    // 增加灵敏度
    if (info.offset.x < -80) {
      setExitX(-cardWidth);
      setIndex(index + 1);
    }
    if (info.offset.x > 80) {
      setExitX(cardWidth);
      setIndex(index + 1);
    }
  };

  // 防止内容被选择或拖动的事件处理函数
  const preventInteraction = (e: React.SyntheticEvent) => {
    e.preventDefault();
    return false;
  };

  // 刷新标签的处理函数
  const handleRefreshTags = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止冒泡，防止触发卡片拖拽
    if (onRefreshTags) {
      onRefreshTags();
    }
  };

  const handleRightButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Right button clicked");
  };

  useEffect(() => {
    if (randomTags) {
      setTagsKey((prev) => prev + 1);
    }
  }, [randomTags]);

  return (
    <motion.div
      className={styles.cardContainer}
      style={{
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
        className={styles.card}
        style={{
          scale,
        }}
        onContextMenu={preventInteraction}
        onCopy={preventInteraction}
        onCut={preventInteraction}
      >
        {course && (
          <>
            <div
              className={styles.stackBoxImage}
              draggable="false"
              onDragStart={preventInteraction}
            >
              <Image
                alt={course.title || "course cover"}
                src={
                  course?.coverImage?.formats?.small?.url
                    ? `${
                        process.env.NEXT_PUBLIC_STRAPI_API_URL ||
                        "http://localhost:1337"
                      }${course.coverImage.formats.small.url}`
                    : "/images/cover1.jpg"
                }
                fill
                style={{
                  objectFit: "cover",
                  pointerEvents: "none",
                }}
                draggable="false"
                priority
                onError={(e) => {
                  e.currentTarget.src = "/images/cover1.jpg";
                }}
                unoptimized
              />
            </div>
            <div
              className={styles.cardContent}
              draggable="false"
              onDragStart={preventInteraction}
            >
              <div className={styles.titleContainer}>
                {frontCard && (
                  <button
                    className={styles.refreshButton}
                    onClick={handleRefreshTags}
                    aria-label="Refresh tags"
                  >
                    ↻
                  </button>
                )}
                <Text
                  variant="body-strong-xl"
                  color="dark"
                  className={styles.title}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "block",
                    maxWidth: "70%",
                  }}
                >
                  {course.title}
                </Text>
                {frontCard && (
                  <button
                    className={styles.placeholderButton}
                    onClick={handleRightButtonClick}
                    aria-label="Options"
                  >
                    ⋯
                  </button>
                )}
              </div>
              <Text
                variant="body-default-xs"
                color="gray600"
                className={styles.subtitle}
              >
                {course.difficulty || "beginner"} · {course.duration || 0} min
              </Text>
              {frontCard && (
                <div className={styles.tagsWrapper}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tagsKey}
                      className={styles.tags}
                      variants={tagsContainerVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      style={{
                        flexWrap: "nowrap" as const,
                        overflowX: "hidden" as const,
                        width: "100%",
                        padding: "0 8px",
                      }}
                    >
                      {(randomTags || course.tags?.slice(0, 4) || []).map(
                        (tag) => (
                          <span
                            key={tag.id}
                            className={styles.tag}
                            style={{
                              whiteSpace: "nowrap" as const,
                              overflow: "hidden" as const,
                              textOverflow: "ellipsis" as const,
                              display: "inline-block",
                              maxWidth: "100px",
                            }}
                          >
                            {tag.name}
                          </span>
                        )
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};
