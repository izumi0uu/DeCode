"use client";

import { motion } from "framer-motion";
import { Flex, Button } from "@/once-ui/components";
import { useRouter } from "next/navigation";

export const NavigationButtons = () => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      style={{ width: "100%", margin: "32px 0" }}
    >
      <Flex style={{ justifyContent: "space-between" }}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="secondary"
            onClick={() => router.back()}
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              background: "rgba(50, 60, 150, 0.2)",
              color: "#fff",
              border: "1px solid rgba(100, 150, 255, 0.3)",
            }}
          >
            Return
          </Button>
        </motion.div>
      </Flex>
    </motion.div>
  );
};
