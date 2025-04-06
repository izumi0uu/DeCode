import React from "react";
import { Flex } from "@/once-ui/components";
import Markdown from "@/features/mdx/components/markdown";

interface LessonContentProps {
  content?: any;
}

export const LessonContent: React.FC<LessonContentProps> = ({ content }) => {
  if (!content) {
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
        <p style={{ color: "var(--color-light)" }}>
          This is where the lesson content would be displayed. In a real
          application, this would be populated with rich text content,
          interactive elements, videos, code samples, and other educational
          materials.
        </p>
      </Flex>
    );
  }

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
      <Markdown>{content}</Markdown>
    </Flex>
  );
};

export default LessonContent;
