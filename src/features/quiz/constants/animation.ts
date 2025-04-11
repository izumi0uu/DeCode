export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

export const pulseAnimation = {
  scale: [1, 1.02, 1],
  boxShadow: [
    "0 0 0 rgba(32, 128, 255, 0)",
    "0 0 20px rgba(32, 128, 255, 0.5)",
    "0 0 0 rgba(32, 128, 255, 0)",
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "loop" as "loop",
  },
};
