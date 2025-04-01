import { Flex } from "@/once-ui/components";
import { useCourseCarousel } from "../../context/courseCarouselContext";
import styles from "./index.module.scss";
import { motion } from "framer-motion";

const AnimateCoursesBoxes = () => {
  const { courses } = useCourseCarousel();

  return (
    <div className={styles.container}>
      {/* Banner 部分 */}
      <div className={styles.banner}>
        <motion.div
          className={styles.bannerBackground}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        <div className={styles.decorations}>
          <div
            className={styles.dot}
            style={{ left: "15%", top: "20%", width: "10px", height: "10px" }}
          />
          <div
            className={styles.dot}
            style={{ left: "35%", top: "45%", width: "8px", height: "8px" }}
          />
          <div
            className={styles.dot}
            style={{ left: "55%", top: "15%", width: "12px", height: "12px" }}
          />
          <div
            className={styles.dot}
            style={{ left: "75%", top: "35%", width: "9px", height: "9px" }}
          />
          <div
            className={styles.dot}
            style={{ left: "25%", top: "70%", width: "11px", height: "11px" }}
          />
        </div>

        {/* 静态光效 */}
        <div className={styles.glow} />

        <motion.div
          className={styles.bannerContent}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className={styles.bannerTitle}>Explore the future world</h1>
          <h2 className={styles.bannerSubtitle}></h2>
          <p className={styles.bannerDescription}>
            From blockchain basics to smart contract development, from DeFi to
            NFT applications, we provide you with a comprehensive Web3
            technology learning system to start your journey of exploring the
            distributed Internet.
          </p>

          <motion.button
            className={styles.exploreButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Start exploring
          </motion.button>
        </motion.div>
      </div>

      {/* 课程卡片部分 */}
      <Flex className={styles.coursesSection}></Flex>
    </div>
  );
};

export { AnimateCoursesBoxes };
