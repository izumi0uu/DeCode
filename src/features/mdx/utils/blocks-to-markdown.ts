/**
 * 将Strapi Blocks格式转换为Markdown文本
 * @param blocks Strapi Blocks格式的内容
 * @returns Markdown格式的文本
 */
export function blocksToMarkdown(blocks: any[]): string {
  if (!Array.isArray(blocks)) {
    return "";
  }

  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return processTextBlock(block.children) + "\n\n";

        case "heading":
          const level = block.level || 1;
          const headingMarkers = "#".repeat(level);
          return `${headingMarkers} ${processTextBlock(block.children)}\n\n`;

        case "list":
          return processListBlock(block) + "\n\n";

        case "code":
          const language = block.language || "";
          return `\`\`\`${language}\n${block.children
            .map((child: any) => child.text || "")
            .join("")}\n\`\`\`\n\n`;

        case "quote":
          return (
            block.children
              .map((item: any) => `> ${processTextBlock(item.children)}`)
              .join("\n") + "\n\n"
          );

        case "image":
          const caption = block.image?.caption
            ? ` "${block.image.caption}"`
            : "";
          return `![${block.image?.alternativeText || ""}](${
            block.image?.url || ""
          }${caption})\n\n`;

        default:
          return "";
      }
    })
    .join("");
}

/**
 * 处理文本块，应用Markdown格式
 */
function processTextBlock(children: any[]): string {
  if (!Array.isArray(children)) {
    return "";
  }

  return children
    .map((child) => {
      let text = child.text || "";

      // 应用样式修饰符
      if (child.bold) {
        text = `**${text}**`;
      }
      if (child.italic) {
        text = `*${text}*`;
      }
      if (child.underline) {
        text = `<u>${text}</u>`;
      }
      if (child.strikethrough) {
        text = `~~${text}~~`;
      }
      if (child.code) {
        text = `\`${text}\``;
      }

      // 处理链接
      if (child.type === "link") {
        return `[${processTextBlock(child.children)}](${child.url})`;
      }

      return text;
    })
    .join("");
}

/**
 * 处理列表块
 */
function processListBlock(block: any): string {
  if (!block.children || !Array.isArray(block.children)) {
    return "";
  }

  return block.children
    .map((item: any, index: number) => {
      const prefix = block.format === "ordered" ? `${index + 1}. ` : "- ";
      return `${prefix}${processTextBlock(item.children)}`;
    })
    .join("\n");
}
