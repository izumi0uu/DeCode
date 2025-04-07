"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { escapeBrackets, escapeMhchem, fixMarkdownBold } from "../../utils";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import CodeBlock from "./code-block";
import { Text, Flex, InlineCode } from "@/once-ui/components";

// 创建一个预处理Unicode字符的函数，特别是处理弯引号
const preprocessUnicode = (text: string): string => {
  // 替换弯引号为直引号以解决LaTeX警告
  return text
    .replace(/[']/g, "'")
    .replace(/["]/g, '"')
    .replace(/["]/g, '"')
    .replace(/[–—]/g, "-");
};

export default function Markdown({
  children,
  mode = "normal",
}: {
  children: string;
  mode?: "normal" | "quiz";
}) {
  // 添加客户端渲染标记，解决水合问题
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 确保输入为字符串
  const markdownText =
    typeof children === "string" ? children : String(children || "");

  // 处理内容
  const processedContent = React.useMemo(() => {
    try {
      // 先处理Unicode字符，然后应用其他转换
      const unicodeFixed = preprocessUnicode(markdownText);
      return fixMarkdownBold(escapeMhchem(escapeBrackets(unicodeFixed)));
    } catch (error) {
      console.error("Error processing markdown:", error);
      return markdownText;
    }
  }, [markdownText]);

  // 定义自定义渲染组件
  const components = React.useMemo(
    () => ({
      a: (props: any) => (
        <Text
          as="a"
          {...props}
          style={{
            color: "#3366FF",
            position: "relative",
            display: "inline-block",
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
            const target = e.currentTarget as HTMLElement;
            if (target.style) {
              target.style.textDecoration = "underline";
            }
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
            const target = e.currentTarget as HTMLElement;
            if (target.style) {
              target.style.textDecoration = "none";
            }
          }}
        >
          {props.children}
        </Text>
      ),
      img: (props: any) => (
        <PhotoProvider>
          <PhotoView key={props.src} src={props.src}>
            <Flex
              direction="row"
              vertical="center"
              style={{
                cursor: "zoom-in",
                margin: "16px 0",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={props.src}
                alt={props.alt || ""}
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "auto",
                  maxHeight: "500px",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              />
            </Flex>
          </PhotoView>
        </PhotoProvider>
      ),
      pre: (props: any) => <CodeBlock highlight={true} {...props} />,
      code: (props: any) => {
        // 检查是否单行代码还是代码块
        if (props.className?.includes("language-")) {
          return <CodeBlock highlight={true} {...props} />;
        }
        return <InlineCode>{props.children}</InlineCode>;
      },
      p: (props: any) => (
        <Text
          as="div" // 使用div而不是p，避免嵌套问题
          style={{
            marginBottom: "16px",
            color: "#F8F9FA",
            fontSize: "16px",
            lineHeight: 1.6,
          }}
        >
          {props.children}
        </Text>
      ),
      h1: (props: any) => (
        <Text
          as="h1"
          style={{
            marginTop: "32px",
            marginBottom: "16px",
            color: "#F8F9FA",
            fontSize: "32px",
            fontWeight: 600,
          }}
        >
          {props.children}
        </Text>
      ),
      h2: (props: any) => (
        <Text
          as="h2"
          style={{
            marginTop: "32px",
            marginBottom: "16px",
            color: "#F8F9FA",
            fontSize: "24px",
            fontWeight: 600,
          }}
        >
          {props.children}
        </Text>
      ),
      h3: (props: any) => (
        <Text
          as="h3"
          style={{
            marginTop: "32px",
            marginBottom: "16px",
            color: "#F8F9FA",
            fontSize: "20px",
            fontWeight: 600,
          }}
        >
          {props.children}
        </Text>
      ),
      blockquote: (props: any) => (
        <Flex
          as="blockquote"
          direction="column"
          style={{
            borderLeft: "4px solid rgba(51, 102, 255, 0.5)",
            paddingLeft: "16px",
            margin: "16px 0",
            fontStyle: "italic",
            color: "#F8F9FA",
          }}
        >
          {props.children}
        </Flex>
      ),
      ul: (props: any) => (
        <Flex
          as="ul"
          direction="column"
          style={{
            margin: "16px 0",
            paddingLeft: "24px",
            color: "#F8F9FA",
            gap: "8px",
          }}
        >
          {props.children}
        </Flex>
      ),
      ol: (props: any) => (
        <Flex
          as="ol"
          direction="column"
          style={{
            margin: "16px 0",
            paddingLeft: "24px",
            color: "#F8F9FA",
            gap: "8px",
          }}
        >
          {props.children}
        </Flex>
      ),
      li: (props: any) => (
        <Text
          as="li"
          style={{
            display: "flex",
            color: "#F8F9FA",
            fontSize: "16px",
            marginBottom: "8px",
          }}
        >
          {props.children}
        </Text>
      ),
      // 添加一个通用处理程序用于处理未知标签
      "*": (props: any) => {
        // 获取标签名和其他属性
        const { node, ...rest } = props;
        const tagName = node.tagName || "span";

        // 针对常见问题标签的处理
        if (tagName.toLowerCase() === "mining") {
          return (
            <Text as="div" style={{ color: "#F8F9FA" }}>
              {props.children}
            </Text>
          );
        }

        // 对于其他未识别的标签，包装在div中
        return <div>{props.children}</div>;
      },
    }),
    []
  );

  const articleStyle = {
    color: "#F8F9FA",
    ...(mode === "quiz" ? { fontSize: "14px" } : {}),
  };

  // 使用客户端渲染标记，避免服务器/客户端渲染差异
  if (!isMounted) {
    return (
      <article style={articleStyle}>
        <div style={{ minHeight: "100px" }}></div>
      </article>
    );
  }

  return (
    <article style={articleStyle}>
      <ReactMarkdown
        rehypePlugins={[
          rehypeRaw,
          [
            rehypeKatex,
            {
              output: "html",
              strict: false, // 禁用严格模式以减少警告
            },
          ],
        ]}
        remarkPlugins={[remarkMath, remarkGfm]}
        components={components}
        remarkRehypeOptions={{ allowDangerousHtml: true }}
      >
        {processedContent}
      </ReactMarkdown>
    </article>
  );
}
