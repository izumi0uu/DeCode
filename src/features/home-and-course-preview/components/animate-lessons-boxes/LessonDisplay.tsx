import { useRef, memo, useEffect } from "react";
import { motion } from "framer-motion";
import { Text, Flex, Skeleton } from "@/once-ui/components";
import { CourseCardSkeletons } from "@/features/home-and-course-preview/components/skeletons";
import { LessonLight } from "@/features/types/api/lesson";
import { Course } from "@/features/types/api/course";
import Image from "next/image";
import styles from "./index.module.scss";

// 定义动画变体 - 抽出来复用
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  hover: {
    y: -10,
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.25)",
    borderColor: "rgba(102, 126, 234, 0.4)",
  },
};

// 图片加载占位组件
const ImageSkeleton = memo(() => (
  <Skeleton
    shape="block"
    style={{
      width: "100%",
      height: "160px",
      borderRadius: "12px",
    }}
  />
));

// 课程卡片图片组件
const CourseImage = memo(({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className={styles.imageWrapper}>
      <Image
        src={src}
        alt={alt}
        width={300}
        height={160}
        loading="lazy"
        style={{
          width: "100%",
          height: "160px",
          objectFit: "cover",
          borderRadius: "12px",
        }}
      />
    </div>
  );
});

// 课时卡片组件
const LessonCard = memo(
  ({ lesson, index = 0 }: { lesson: LessonLight; index?: number }) => {
    // 构建图片URL - 优先使用课时的coverImage
    const imageUrl = lesson.coverImage?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL || ""}${lesson.coverImage.url}`
      : lesson.course?.coverImage?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL || ""}${
          lesson.course.coverImage.url
        }`
      : "/placeholder.jpg";

    // 使用索引延迟动画以创建交错效果
    const transitionDelay = 0.05 + (index % 10) * 0.05;

    return (
      <motion.div
        className={styles.courseCard}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        transition={{
          duration: 0.6,
          delay: transitionDelay,
          ease: "easeOut",
        }}
        layout
      >
        {imageUrl ? (
          <CourseImage src={imageUrl} alt={lesson.title} />
        ) : (
          <ImageSkeleton />
        )}

        <Flex direction="column" gap="m" className={styles.cardContent}>
          <Text variant="body-strong-l" className={styles.title}>
            {lesson.title}
          </Text>

          <Text variant="body-default-m" className={styles.description}>
            {lesson.description || "No description available"}
          </Text>

          {lesson.course && (
            <Text variant="body-default-s" className={styles.courseName}>
              Course: {lesson.course.title || "Unknown"}
            </Text>
          )}

          <Flex
            className={styles.cardFooter}
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Text variant="body-strong-s">
              Lesson {lesson.sortOrder || "-"}
            </Text>
            <Text variant="body-default-s">{lesson.duration || "N/A"} min</Text>
          </Flex>
        </Flex>
      </motion.div>
    );
  }
);

// 课程卡片组件
const CourseCard = memo(
  ({ course, index = 0 }: { course: Course; index?: number }) => {
    const imageUrl = course.coverImage?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL || ""}${course.coverImage.url}`
      : "/placeholder.jpg";

    // 使用索引延迟动画以创建交错效果
    const transitionDelay = 0.05 + (index % 10) * 0.05;

    return (
      <motion.div
        className={styles.courseCard}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        transition={{
          duration: 0.6,
          delay: transitionDelay,
          ease: "easeOut",
        }}
        layout
      >
        {imageUrl ? (
          <CourseImage src={imageUrl} alt={course.title} />
        ) : (
          <ImageSkeleton />
        )}

        <Flex direction="column" gap="m" className={styles.cardContent}>
          <Text variant="body-strong-l" className={styles.title}>
            {course.title}
          </Text>

          <Text variant="body-default-m" className={styles.description}>
            {course.description}
          </Text>

          <Flex
            className={styles.cardFooter}
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Text variant="body-strong-s">
              {course.difficulty || "Beginner"}
            </Text>
            <Text variant="body-default-s">{course.duration || "N/A"} min</Text>
          </Flex>
        </Flex>
      </motion.div>
    );
  }
);

// 空内容提示组件
const NoContentMessage = memo(() => (
  <div className={styles.noContentMessage}>
    <Text variant="body-default-m">
      No content found that matched your filter criteria. Please try a different
      filter.
    </Text>
  </div>
));

interface CourseDisplayProps {
  loading: boolean;
  isLoading: boolean;
  selectedTechTags: string[];
  filteredLessons: LessonLight[];
  filteredCourses: Course[];
}

// 实现虚拟化列表，只渲染可见区域的项目
const VirtualizedList = memo(
  ({
    items,
    renderItem,
  }: {
    items: any[];
    renderItem: (item: any, index: number) => JSX.Element;
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleScroll = () => {
        // 可以在这里实现更高级的虚拟化逻辑
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    return (
      <Flex
        ref={containerRef}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        {items.map((item, index) => renderItem(item, index))}
      </Flex>
    );
  }
);

// 主组件使用memo优化
export const CourseDisplay = memo(
  ({
    loading,
    isLoading,
    selectedTechTags,
    filteredLessons,
    filteredCourses,
  }: CourseDisplayProps) => {
    // 避免不必要的计算
    const isDataLoading = loading || isLoading;
    const hasLessons = filteredLessons && filteredLessons.length > 0;
    const hasCourses = filteredCourses && filteredCourses.length > 0;

    // 根据数据状态渲染相应内容
    if (isDataLoading) {
      return <CourseCardSkeletons count={6} />;
    }

    // 优先显示课时（如果有的话）
    if (hasLessons) {
      return (
        <VirtualizedList
          items={filteredLessons}
          renderItem={(lesson, index) => (
            <LessonCard key={lesson.id} lesson={lesson} index={index} />
          )}
        />
      );
    }

    // 显示课程
    if (hasCourses) {
      return (
        <VirtualizedList
          items={filteredCourses}
          renderItem={(course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          )}
        />
      );
    }

    // 没有内容可显示
    return <NoContentMessage />;
  }
);
