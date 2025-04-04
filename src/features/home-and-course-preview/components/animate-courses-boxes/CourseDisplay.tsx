import { motion } from "framer-motion";
import { Text, Flex } from "@/once-ui/components";
import { CourseCardSkeletons } from "@/features/home-and-course-preview/components/skeletons";
import { LessonLight } from "@/features/types/api/lesson";
import { Course } from "@/features/types/api/course";
import styles from "./index.module.scss";

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
    return <CourseCardSkeletons count={3} />;
  }

  // 优先显示课时（如果有的话）
  if (filteredLessons.length > 0) {
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
        {filteredLessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            className={styles.courseCard}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.1 + index * 0.1,
              ease: "easeOut",
            }}
            whileHover={{
              y: -10,
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.25)",
              borderColor: "rgba(102, 126, 234, 0.4)",
            }}
          >
            <div className={styles.cardHeader}>
              <h3>{lesson.title}</h3>
            </div>
            <div className={styles.cardContent}>
              <p>{lesson.description || "No description available"}</p>
              {lesson.course && (
                <p className={styles.courseName}>
                  Course: {lesson.course.title || "Unknown"}
                </p>
              )}
            </div>
            <div className={styles.cardFooter}>
              <span>Lesson {lesson.sortOrder || "-"}</span>
              <span>{lesson.duration || "N/A"} min</span>
            </div>
          </motion.div>
        ))}
      </Flex>
    );
  }

  // 显示选中标签下的课程
  if (filteredCourses.length > 0) {
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
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            className={styles.courseCard}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.1 + index * 0.1,
              ease: "easeOut",
            }}
            whileHover={{
              y: -10,
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.25)",
              borderColor: "rgba(102, 126, 234, 0.4)",
            }}
          >
            <div className={styles.cardHeader}>
              <h3>{course.title}</h3>
            </div>
            <div className={styles.cardContent}>
              <p>{course.description}</p>
            </div>
            <div className={styles.cardFooter}>
              <span>{course.difficulty || "Beginner"}</span>
              <span>{course.duration || "N/A"} min</span>
            </div>
          </motion.div>
        ))}
      </Flex>
    );
  }

  // 如果没有内容显示提示信息
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={styles.noContentMessage}
    >
      <Text variant="body-default-m">
        No content was found that matched your filter criteria. Please try a
        different tag combination.
      </Text>
    </motion.div>
  );
};
