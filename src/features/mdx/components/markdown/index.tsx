"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { escapeBrackets, escapeMhchem, fixMarkdownBold } from "../../utils";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { SmartImage } from "@/once-ui/components";
import "react-photo-view/dist/react-photo-view.css";
import CodeBlock from "../code/code-block";
import PreSingleLine from "../code/pre-single-line";
import { Text, Flex, InlineCode } from "@/once-ui/components";
import styles from "./markdown.module.scss";

const Markdown = ({
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
          style={{ color: "var(--color-function-link)" }}
          className="mdx-link"
        >
          {props.children}
        </Text>
      ),
      img: (props: any) => (
        <PhotoProvider>
          <PhotoView key={props.src} src={props.src}>
            <Flex
              direction="row"
              align="center"
              center
              className="image-container"
            >
              <SmartImage
                src={props.src}
                alt={props.alt || ""}
                width={1200}
                height={800}
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "auto",
                  maxHeight: "500px",
                  borderRadius: "var(--border-radius-m)",
                }}
                priority={false}
                sizes="100vw"
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
          as="p"
          style={{
            marginBottom: "var(--spacing-m)",
            color: "var(--color-light)",
            fontSize: "var(--font-size-m)",
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
            marginTop: "var(--spacing-xl)",
            marginBottom: "var(--spacing-l)",
            color: "var(--color-light)",
            fontSize: "var(--font-size-xl)",
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
            marginTop: "var(--spacing-xl)",
            marginBottom: "var(--spacing-l)",
            color: "var(--color-light)",
            fontSize: "var(--font-size-l)",
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
            marginTop: "var(--spacing-xl)",
            marginBottom: "var(--spacing-l)",
            color: "var(--color-light)",
            fontSize: "var(--font-size-m)",
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
            borderLeft: "4px solid var(--color-primary-alpha-medium)",
            paddingLeft: "var(--spacing-m)",
            margin: "var(--spacing-m) 0",
            fontStyle: "italic",
            color: "var(--color-light)",
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
            margin: "var(--spacing-m) 0",
            paddingLeft: "var(--spacing-xl)",
            color: "var(--color-light)",
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
            margin: "var(--spacing-m) 0",
            paddingLeft: "var(--spacing-xl)",
            color: "var(--color-light)",
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
            color: "var(--color-light)",
            fontSize: "var(--font-size-m)",
            marginBottom: "var(--spacing-s)",
          }}
        >
          {props.children}
        </Text>
      ),
    };
  }, []);

  return (
    <article
      className={mode === "normal" ? styles.normalMode : styles.quizMode}
    >
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

export { Markdown };
