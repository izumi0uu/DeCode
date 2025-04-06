import React from "react";
import { Flex } from "@/once-ui/components";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

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

  console.log(effectiveContentType);

  // 添加调试信息，检查具体内容格式
  if (Array.isArray(content) && content.length > 0) {
    console.log("First block structure:", JSON.stringify(content[0], null, 2));
    // 检查是否包含纯文本的markdown标记
    if (
      typeof content === "string" &&
      ((content as string).includes("##") || (content as string).includes("- "))
    ) {
      console.log(
        "Content appears to be markdown text, not Strapi Blocks format"
      );
    }
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
      {effectiveContentType === "blocks" ? (
        <BlocksRenderer
          content={content}
          modifiers={{
            bold: ({ children }) => (
              <strong style={{ color: "var(--color-light)" }}>
                {children}
              </strong>
            ),
            italic: ({ children }) => (
              <em style={{ color: "var(--color-light)" }}>{children}</em>
            ),
            underline: ({ children }) => (
              <u style={{ color: "var(--color-light)" }}>{children}</u>
            ),
            strikethrough: ({ children }) => (
              <s style={{ color: "var(--color-light)" }}>{children}</s>
            ),
            code: ({ children }) => (
              <code
                className="inline-code"
                style={{ color: "var(--color-light)" }}
              >
                {children}
              </code>
            ),
          }}
          blocks={{
            paragraph: ({ children }) => (
              <p style={{ color: "var(--color-light)", marginBottom: "1rem" }}>
                {children}
              </p>
            ),
            heading: ({ children, level }) => {
              const Tag = `h${level}` as keyof JSX.IntrinsicElements;
              return (
                <Tag
                  style={{ color: "var(--color-light)", marginBottom: "1rem" }}
                >
                  {children}
                </Tag>
              );
            },
            list: ({ children, format }) => {
              if (format === "ordered") {
                return (
                  <ol
                    style={{
                      paddingLeft: "1.5rem",
                      marginBottom: "1rem",
                      color: "var(--color-light)",
                    }}
                  >
                    {children}
                  </ol>
                );
              }
              return (
                <ul
                  style={{
                    paddingLeft: "1.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-light)",
                  }}
                >
                  {children}
                </ul>
              );
            },
            code: ({ children }) => (
              <pre
                style={{
                  background: "rgba(0, 0, 0, 0.3)",
                  padding: "1rem",
                  borderRadius: "4px",
                  overflowX: "auto",
                  marginBottom: "1rem",
                  color: "var(--color-light)",
                }}
              >
                <code>{children}</code>
              </pre>
            ),
            quote: ({ children }) => (
              <blockquote
                style={{
                  borderLeft: "4px solid rgba(51, 102, 255, 0.5)",
                  paddingLeft: "1rem",
                  fontStyle: "italic",
                  marginBottom: "1rem",
                  color: "var(--color-light)",
                }}
              >
                {children}
              </blockquote>
            ),
            image: ({ image }) => (
              <div style={{ marginBottom: "1rem" }}>
                <img
                  src={image.url}
                  alt={image.alternativeText || ""}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "4px",
                  }}
                />
                {image.caption && (
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--color-light)",
                      marginTop: "0.5rem",
                    }}
                  >
                    {image.caption}
                  </p>
                )}
              </div>
            ),
            link: ({ children, url }) => (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--color-primary)",
                  textDecoration: "underline",
                }}
              >
                {children}
              </a>
            ),
          }}
        />
      ) : effectiveContentType === "mdx" ? (
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          style={{ color: "var(--color-light)" }}
        />
      ) : (
        <div style={{ color: "var(--color-light)" }}>
          {typeof content === "object" ? JSON.stringify(content) : content}
        </div>
      )}
    </Flex>
  );
};

export default LessonContent;
