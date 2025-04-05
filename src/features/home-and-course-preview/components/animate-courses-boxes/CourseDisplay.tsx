import { motion } from "framer-motion";
import { Text, Flex, Skeleton } from "@/once-ui/components";
import { CourseCardSkeletons } from "@/features/home-and-course-preview/components/skeletons";
import { LessonLight } from "@/features/types/api/lesson";
import { Course } from "@/features/types/api/course";
import { Suspense } from "react";
import Image from "next/image";
import styles from "./index.module.scss";

// 图片加载占位组件
const ImageSkeleton = () => (
  <Skeleton
    shape="block"
    style={{
      width: "100%",
      height: "160px",
      borderRadius: "12px",
    }}
  />
);

// 课程卡片图片组件
const CourseImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className={styles.imageWrapper}>
      <Image
        src={src}
        alt={alt}
        width={300}
        height={160}
        style={{
          width: "100%",
          height: "160px",
          objectFit: "cover",
          borderRadius: "12px",
        }}
      />
    </div>
  );
};

// 课时卡片组件
const LessonCard = ({ lesson }: { lesson: LessonLight }) => {
  // 构建图片URL - 优先使用课时的coverImage
  const imageUrl = lesson.coverImage?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL || ""}${lesson.coverImage.url}`
    : lesson.course?.coverImage?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL || ""}${
        lesson.course.coverImage.url
      }`
    : "/placeholder.jpg";

  return (
    <motion.div
      className={styles.courseCard}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      whileHover={{
        y: -10,
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.25)",
        borderColor: "rgba(102, 126, 234, 0.4)",
      }}
    >
      <Suspense fallback={<ImageSkeleton />}>
        <CourseImage src={imageUrl} alt={lesson.title} />
      </Suspense>

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
          <Text variant="body-strong-s">Lesson {lesson.sortOrder || "-"}</Text>
          <Text variant="body-default-s">{lesson.duration || "N/A"} min</Text>
        </Flex>
      </Flex>
    </motion.div>
  );
};

// 课程卡片组件
const CourseCard = ({ course }: { course: Course }) => {
  const imageUrl = course.coverImage?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL || ""}${course.coverImage.url}`
    : "/placeholder.jpg";

  return (
    <motion.div
      className={styles.courseCard}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      whileHover={{
        y: -10,
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.25)",
        borderColor: "rgba(102, 126, 234, 0.4)",
      }}
    >
      <Suspense fallback={<ImageSkeleton />}>
        <CourseImage src={imageUrl} alt={course.title} />
      </Suspense>

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
          <Text variant="body-strong-s">{course.difficulty || "Beginner"}</Text>
          <Text variant="body-default-s">{course.duration || "N/A"} min</Text>
        </Flex>
      </Flex>
    </motion.div>
  );
};

interface CourseDisplayProps {
  loading: boolean;
  isLoading: boolean;
  selectedTechTags: string[];
  filteredLessons: LessonLight[];
  filteredCourses: Course[];
}

export const CourseDisplay = ({
  loading,
  isLoading,
  selectedTechTags,
  filteredLessons,
  filteredCourses,
}: CourseDisplayProps) => {
  if (loading || isLoading) {
    return <CourseCardSkeletons count={6} />;
  }

  // 优先显示课时（如果有的话）
  if (filteredLessons && filteredLessons.length > 0) {
    return (
      <Flex
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        {filteredLessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </Flex>
    );
  }

  // 显示课程
  if (filteredCourses && filteredCourses.length > 0) {
    return (
      <Flex
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </Flex>
    );
  }

  // 没有内容可显示
  return (
    <div className={styles.noContentMessage}>
      <Text variant="body-default-m">
        No content found that matched your filter criteria. Please try a
        different filter.
      </Text>
    </div>
  );
};
