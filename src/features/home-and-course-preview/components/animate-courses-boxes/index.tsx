import { useCallback, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Text, Flex, Button } from "@/once-ui/components";
import styles from "./index.module.scss";

export const AnimateCoursesBoxes = () => {
  const [loading, setLoading] = useState(false);
  const coursesSectionRef = useRef<HTMLDivElement>(null);

  const handleExplore = useCallback(() => {
    if (coursesSectionRef.current) {
      const yOffset =
        coursesSectionRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: yOffset,
        behavior: "smooth",
      });
    }
  }, []);

  // Mock course data - this would typically come from an API
  const courses = [
    { id: 1, title: "Introduction to Web3" },
    { id: 2, title: "Blockchain Fundamentals" },
    { id: 3, title: "Smart Contract Development" },
  ];

  // 预定义光点位置和大小
  const dotPositions = [
    { width: "20px", height: "20px", left: "15%", top: "20%", delay: "0.2s" },
    { width: "16px", height: "16px", left: "35%", top: "45%", delay: "0.5s" },
    { width: "22px", height: "22px", left: "55%", top: "15%", delay: "0.3s" },
    { width: "18px", height: "18px", left: "75%", top: "35%", delay: "0.8s" },
    { width: "24px", height: "24px", left: "25%", top: "70%", delay: "0.6s" },
  ];

  return (
    <Flex direction="column" className={styles.container}>
      {/* Banner Section */}
      <div className={styles.banner}>
        <div className={styles.bannerBackground}>
          <div className={styles.glow}></div>
          <div className={styles.decorations}>
            {dotPositions.map((dot, i) => (
              <div
                key={i}
                className={styles.dot}
                style={{
                  width: dot.width,
                  height: dot.height,
                  left: dot.left,
                  top: dot.top,
                  animationDelay: dot.delay,
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className={styles.bannerContent}>
          <Text as="h1" className={styles.bannerTitle} variant="body-strong-xl">
            Discover Web3 Education
          </Text>

          <Text
            as="h2"
            className={styles.bannerSubtitle}
            variant="body-strong-l"
          >
            Learn. Build. Innovate.
          </Text>

          <Text
            as="p"
            className={styles.bannerDescription}
            variant="body-default-m"
          >
            Join our community and gain the skills needed to thrive in the
            decentralized future. Explore courses crafted by industry experts.
          </Text>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <Button
              variant="primary"
              size="m"
              onClick={handleExplore}
              className={styles.exploreButton}
            >
              Start exploring
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Courses Section */}
      <Flex
        ref={coursesSectionRef}
        className={styles.coursesSection}
        align="center"
        wrap
      >
        {!loading ? (
          courses.map((course) => (
            <motion.div
              key={course.id}
              className={styles.courseCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * course.id }}
            >
              {course.title}
            </motion.div>
          ))
        ) : (
          <Text variant="body-strong-l">Loading courses...</Text>
        )}
      </Flex>
    </Flex>
  );
};
