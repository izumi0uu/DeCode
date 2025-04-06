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
        backgroundColor: "#1E1E1E",
        border: "1px solid #333333",
        borderRadius: "4px",
        padding: "16px",
        margin: "16px 0",
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
