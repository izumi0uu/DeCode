import { motion } from "framer-motion";
import { Text, Button } from "@/once-ui/components";
import styles from "./index.module.scss";

interface BannerProps {
  handleExplore: () => void;
}

export const Banner = ({ handleExplore }: BannerProps) => {
  // 预定义光点位置和大小
  const dotPositions = [
    { width: "20px", height: "20px", left: "15%", top: "20%", delay: "0.2s" },
    { width: "16px", height: "16px", left: "35%", top: "45%", delay: "0.5s" },
    { width: "22px", height: "22px", left: "55%", top: "15%", delay: "0.3s" },
    { width: "18px", height: "18px", left: "75%", top: "35%", delay: "0.8s" },
    { width: "24px", height: "24px", left: "25%", top: "70%", delay: "0.6s" },
  ];

  return (
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Text as="h1" className={styles.bannerTitle} variant="body-strong-xl">
            Discover Web3 Education
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <Text
            as="h2"
            className={styles.bannerSubtitle}
            variant="body-strong-l"
          >
            Learn. Build. Innovate.
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        >
          <Text
            as="p"
            className={styles.bannerDescription}
            variant="body-default-m"
          >
            Join our community and gain the skills needed to thrive in the
            decentralized future. Explore courses crafted by industry experts.
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.6,
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
  );
};
