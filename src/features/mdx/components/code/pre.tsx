import SyntaxHighlighter from "./syntax-hightlighter";
import { Flex, Text } from "@/once-ui/components";
import { CopyButton } from "./copy-button";
import styles from "./pre.module.scss";

const Pre = ({
  language,
  children,
}: {
  language: string;
  children: string;
}) => {
  return (
    <Flex
      direction="column"
      position="relative"
      className={styles.codeContainer}
      style={{
        backgroundColor: "var(--color-background-code)",
        border: "1px solid var(--color-border-outline)",
        borderRadius: "var(--radius-s)",
        padding: "var(--spacing-m)",
        margin: "var(--spacing-m) 0",
      }}
    >
      <div className={styles.codeContent}>
        <SyntaxHighlighter language={language}>{children}</SyntaxHighlighter>
      </div>
      <div className={styles.copyButtonWrapper}>
        <CopyButton value={children} />
      </div>
    </Flex>
  );
};

export default Pre;
