// src/features/courses/components/CourseCard.tsx
import { motion } from "framer-motion";
import { Flex, Text, SmartImage } from "@/once-ui/components";
import { Course } from "@/features/types/api/course";

// Helper function to get color based on difficulty
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "rgba(0, 200, 83, 0.2)";
    case "medium":
      return "rgba(255, 170, 0, 0.2)";
    case "hard":
      return "rgba(255, 71, 87, 0.2)";
    default:
      return "rgba(255, 255, 255, 0.1)";
  }
};

// 课程元数据标签组件
export const CourseMetaTags = ({ course }: { course: Course }) => (
  <Flex
    gap="m"
    style={{
      marginTop: "12px",
      fontSize: "12px",
      width: "100%",
    }}
  >
    {course.difficulty && (
      <Flex
        style={{
          background: getDifficultyColor(course.difficulty),
          borderRadius: "4px",
          padding: "4px 8px",
        }}
      >
        <Text
          variant="body-default-xs"
          color="light"
          style={{ fontSize: "11px" }}
        >
          {course.difficulty}
        </Text>
      </Flex>
    )}
    {course.duration && (
      <Flex
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "4px",
          padding: "4px 8px",
        }}
      >
        <Text
          variant="body-default-xs"
          color="light"
          style={{ fontSize: "11px" }}
        >
          {course.duration} min
        </Text>
      </Flex>
    )}
  </Flex>
);

// 动画变体
const cardVariants = {
  hidden: {
    // opacity: 0,
    y: 20,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      type: "tween",
      stiffness: 260,
      damping: 20,
    },
  }),
  hover: {
    y: -3,
    boxShadow: "0 10px 20px rgba(0, 0, 255, 0.15)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    y: -3,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  active: {
    y: 0,
    backgroundColor: "rgba(51, 102, 255, 0.15)",
    borderColor: "rgba(51, 102, 255, 0.5)",
    boxShadow: "0 8px 16px rgba(0, 0, 255, 0.1)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
};

// 获取占位图
const getPlaceholderImage = (courseId: number) => {
  const imageIndex = (courseId % 5) + 1;
  return `/images/cover${imageIndex}.jpg`;
};

// 课程卡片组件
interface CourseCardProps {
  course: Course;
  isActive: boolean;
  index: number;
  onCourseClick: (course: Course, e: React.MouseEvent) => void;
}

export const CourseCard = ({
  course,
  isActive,
  index,
  onCourseClick,
}: CourseCardProps) => {
  return (
    <motion.div
      key={course.id}
      custom={index}
      initial="hidden"
      animate={isActive ? "active" : "visible"}
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      onClick={(e) => onCourseClick(course, e)}
      style={{ marginBottom: "16px", cursor: "pointer", width: "100%" }}
    >
      <Flex
        direction="column"
        padding="m"
        style={{
          width: "100%",
          borderRadius: "12px",
          background: isActive
            ? "rgba(51, 102, 255, 0.15)"
            : "rgba(30, 30, 60, 0.4)",
          cursor: "pointer",
          transition:
            "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          border: "1px solid",
          borderColor: isActive
            ? "rgba(51, 102, 255, 0.5)"
            : "rgba(51, 102, 255, 0.1)",
          boxShadow: isActive ? "0 8px 16px rgba(0, 0, 255, 0.1)" : "none",
          overflow: "hidden",
        }}
      >
        {/* Course Image */}
        <Flex
          style={{
            height: "120px",
            width: "100%",
            borderRadius: "8px",
            overflow: "hidden",
            marginBottom: "12px",
            position: "relative",
          }}
        >
          <SmartImage
            src={
              course.coverImage?.formats?.small?.url
                ? `${
                    process.env.NEXT_PUBLIC_STRAPI_API_URL ||
                    "http://localhost:1337"
                  }${course.coverImage.formats.small.url}`
                : getPlaceholderImage(course.id)
            }
            alt={course.title}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
          />
        </Flex>

        {/* Fallback for image in case it doesn't load */}
        {!course.coverImage && (
          <Flex
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              background: `linear-gradient(135deg, rgba(51,102,255,0.3) 0%, rgba(18,18,40,0.8) 100%)`,
              width: "100%",
              height: "120px",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              marginBottom: "12px",
            }}
          >
            <Text variant="heading-strong-l" color="light">
              {course.title.charAt(0)}
            </Text>
          </Flex>
        )}

        {/* Course Info */}
        <Text
          variant="body-strong-s"
          color="light"
          style={{
            fontSize: "16px",
            lineHeight: "24px",
          }}
        >
          {course.title}
        </Text>

        {course.description && (
          <Text
            variant="body-default-xs"
            color="light"
            style={{
              opacity: 0.7,
              marginTop: "4px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {course.description}
          </Text>
        )}

        {/* Course Meta */}
        <CourseMetaTags course={course} />
      </Flex>
    </motion.div>
  );
};
