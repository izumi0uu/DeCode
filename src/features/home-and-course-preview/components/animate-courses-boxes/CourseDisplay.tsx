import { motion } from "framer-motion";
import { Text } from "@/once-ui/components";
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

  if (selectedTechTags.length > 0) {
    // 如果选择了技术标签，显示筛选后的课时
    if (filteredLessons.length > 0) {
      return (
        <>
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
              {lesson.title}
            </motion.div>
          ))}
        </>
      );
    } else {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={styles.noContentMessage}
        >
          <Text variant="body-default-m">
            No courses were found that matched your filter criteria. Please try
            a different tag combination.
          </Text>
        </motion.div>
      );
    }
  } else {
    // 否则显示筛选后的课程
    return (
      <>
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
            {course.title}
          </motion.div>
        ))}
      </>
    );
  }
};
