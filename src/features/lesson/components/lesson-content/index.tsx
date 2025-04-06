import React from "react";
import { Flex } from "@/once-ui/components";
import Markdown from "@/features/mdx/components/markdown";
import { blocksToMarkdown } from "@/features/mdx/utils/blocks-to-markdown";

interface LessonContentProps {
  content?: any; // 适配Strapi Blocks格式
  contentType?: "blocks" | "mdx" | "text";
}

export const LessonContent: React.FC<LessonContentProps> = ({
  content,
  contentType = "text", // 默认为text类型
}) => {
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

  // 检测content是否为Strapi blocks格式(自动检测)
  const isBlocksContent =
    Array.isArray(content) &&
    content.length > 0 &&
    typeof content[0] === "object" &&
    "type" in content[0] &&
    "children" in content[0];

  // 如果content是Strapi blocks格式但没有指定contentType，则自动设置为blocks
  const effectiveContentType =
    contentType === "blocks" || (contentType !== "mdx" && isBlocksContent)
      ? "blocks"
      : contentType;

  // 将Strapi Blocks格式转换为Markdown文本
  const markdownContent = React.useMemo(() => {
    if (effectiveContentType === "blocks" && isBlocksContent) {
      try {
        return blocksToMarkdown(content);
      } catch (error) {
        console.error("Error converting blocks to markdown:", error);
        return "Error converting content";
      }
    }

    // 如果已经是markdown文本，或其他文本，直接返回
    return typeof content === "string" ? content : JSON.stringify(content);
  }, [content, effectiveContentType, isBlocksContent]);

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
      {effectiveContentType === "blocks" ? (
        <Markdown>{markdownContent}</Markdown>
      ) : effectiveContentType === "mdx" ? (
        <Markdown>{typeof content === "string" ? content : ""}</Markdown>
      ) : (
        <div style={{ color: "var(--color-light)" }}>
          {typeof content === "string" ? (
            <Markdown>{content}</Markdown>
          ) : (
            JSON.stringify(content)
          )}
        </div>
      )}
    </Flex>
  );
};

export default LessonContent;
