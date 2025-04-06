"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { escapeBrackets, escapeMhchem, fixMarkdownBold } from "../utils";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Image from "next/image";
import "react-photo-view/dist/react-photo-view.css";
import CodeBlock from "./code/code-block";
import PreSingleLine from "./code/pre-single-line";
import { Text, Flex, InlineCode } from "@/once-ui/components";

export default function Markdown({
  children,
  mode = "normal",
}: {
  children: string;
  mode?: "normal" | "quiz";
}) {
  const escapedContent = useMemo(() => {
    return fixMarkdownBold(escapeMhchem(escapeBrackets(children || "")));
  }, [children]);

  const components = useMemo(() => {
    return {
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
          as="div"
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
            color: "#F8F9FA",
            fontSize: "16px",
            marginBottom: "8px",
          }}
        >
          {props.children}
        </Text>
      ),
    };
  }, []);

  const articleStyle = {
    color: "#F8F9FA",
    ...(mode === "quiz" ? { fontSize: "14px" } : {}),
  };

  return (
    <article style={articleStyle}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, [rehypeKatex, { output: "mathml" }]]}
        remarkPlugins={[remarkMath, remarkGfm]}
        components={components}
      >
        {escapedContent}
      </ReactMarkdown>
    </article>
  );
}
