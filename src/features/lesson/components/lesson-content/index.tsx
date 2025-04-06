import React from "react";
import { Flex, Text } from "@/once-ui/components";

interface LessonContentProps {
  content?: string;
}

export const LessonContent: React.FC<LessonContentProps> = ({ content }) => {
  return (
    <Flex
      direction="column"
      style={{
        padding: "24px",
        borderRadius: "12px",
        background: "rgba(51, 102, 255, 0.05)",
        border: "1px solid rgba(51, 102, 255, 0.2)",
      }}
    >
      <Text variant="body-default-m" color="light">
        {content ||
          "This is where the lesson content would be displayed. In a real application, this would be populated with rich text content, interactive elements, videos, code samples, and other educational materials."}
      </Text>
    </Flex>
  );
};

export default LessonContent;
