import { Course, CourseResponse } from "@/features/types/api/course";
import { useTransform, useMotionValue, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Flex } from "@/once-ui/components";

const StackBox = ({
  frontCard,
  drag,
  index,
  setIndex,
  popularCourses,
}: {
  frontCard?: boolean;
  drag?: "x" | "y";
  index?: number;
  setIndex?: (index: number) => void;
  popularCourses?: Course;
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
      setIndex(index + 1);
    }
    if (info.offset.x > 100) {
      setExitX(250);
      setIndex(index + 1);
    }
  };

  useEffect(() => {
    console.log(popularCourses);
  }, [popularCourses, index]);

  return (
    <motion.div
      style={{
        width: 220,
        height: 220,
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
          width: 220,
          height: 220,
          backgroundColor: "#fff",
          borderRadius: 30,
          scale,
        }}
      >
        {popularCourses && (
          <>
            <Flex>
              <Image
                alt={popularCourses.title || "course cover"}
                src={
                  popularCourses?.coverImage?.formats?.small?.url
                    ? `${
                        process.env.NEXT_PUBLIC_STRAPI_API_URL ||
                        "http://localhost:1337"
                      }${popularCourses.coverImage.formats.small.url}`
                    : "/images/cover1.jpg" // 默认使用本地备用图片
                }
                fill
                style={{
                  objectFit: "cover",
                  borderRadius: 30,
                }}
                priority
                onError={(e) => {
                  e.currentTarget.src = "/images/cover1.jpg";
                }}
              />
            </Flex>
            <Flex>{popularCourses.title}</Flex>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export { StackBox };
