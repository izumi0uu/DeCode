import { Course, CourseResponse } from "@/features/types/api/course";
import { useTransform, useMotionValue, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Text } from "@/once-ui/components";

const StackBox = ({
  frontCard,
  drag,
  index,
  setIndex,
  course,
}: {
  frontCard?: boolean;
  drag?: "x" | "y";
  index?: number;
  setIndex?: (index: number) => void;
  course?: Course;
}) => {
  const [exitX, setExitX] = useState(0);

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
    initial: { scale: 0.6, y: 40, opacity: 0, zIndex: 1 },
    animate: { scale: 0.8, y: 40, opacity: 0.7, zIndex: 1 },
    exit: { opacity: 0, scale: 1, transition: { duration: 0.2 } },
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

  useEffect(() => {
    console.log(course);
  }, [course, index]);

  return (
    <motion.div
      style={{
        width: cardWidth,
        height: cardHeight,
        position: "absolute",
        x,
        rotate,
        cursor: "grab",
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
          width: cardWidth,
          height: cardHeight,
          backgroundColor: "#fff",
          borderRadius: 30,
          scale,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          border: "4px solid #3366FF",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: "6px", // 给边框和内容间添加空白
          userSelect: "none", // 防止选择文本
        }}
        onContextMenu={preventInteraction} // 防止右键菜单
        onCopy={preventInteraction} // 防止复制
        onCut={preventInteraction} // 防止剪切
      >
        {course && (
          <>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "70%",
                borderRadius: "24px",
                overflow: "hidden",
                marginBottom: "12px",
                pointerEvents: "none", // 防止鼠标交互
              }}
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
                    : "/images/cover1.jpg" // 默认使用本地备用图片
                }
                fill
                style={{
                  objectFit: "cover",
                  pointerEvents: "none", // 防止图片鼠标交互
                }}
                draggable="false"
                priority
                onError={(e) => {
                  e.currentTarget.src = "/images/cover1.jpg";
                }}
                unoptimized // 防止Next.js优化导致图片可交互
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "16px",
                height: "30%",
                textAlign: "center",
                overflow: "hidden",
                userSelect: "none", // 防止选择文本
                pointerEvents: "none", // 防止鼠标交互
              }}
              draggable="false"
              onDragStart={preventInteraction}
            >
              <Text
                variant="body-strong-xl"
                color="dark"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  pointerEvents: "none", // 防止文本鼠标交互
                }}
              >
                {course.title}
              </Text>
              <Text
                variant="body-default-xs"
                color="gray600"
                style={{
                  marginTop: "4px",
                  pointerEvents: "none", // 防止文本鼠标交互
                }}
              >
                {course.difficulty || "beginner"} · {course.duration || 0} min
              </Text>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export { StackBox };
