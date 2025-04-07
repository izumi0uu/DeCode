import React from "react";
import { Flex } from "@/once-ui/components";
import Markdown from "@/features/mdx/components/code/markdown";

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

  // 确保content是字符串类型
  const safeContent = React.useMemo(() => {
    if (typeof content === "string") {
      return content;
    }

    // 如果是数组，可能是Strapi Blocks格式
    if (Array.isArray(content)) {
      try {
        // 尝试转换为可读性更好的格式
        return JSON.stringify(content, null, 2);
      } catch (e) {
        console.error("Error processing content:", e);
        return "Error processing content";
      }
    }

    // 其他对象类型
    return JSON.stringify(content, null, 2);
  }, [content]);

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
      <Markdown>{safeContent}</Markdown>
    </Flex>
  );
};

export default LessonContent;
