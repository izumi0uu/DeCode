import { memo } from "react";
import { Icon } from "@/once-ui/components";
import { useHighlight } from "../../hooks/use-highlight";

export interface SyntaxHighlighterProps {
  children: string;
  language: string;
}

const SyntaxHighlighter = memo<SyntaxHighlighterProps>(
  ({ children, language }) => {
    const { data, isLoading } = useHighlight(children.trim(), language);

    return (
      <>
        {isLoading || !data ? (
          <div className="text-wtf-content-3">
            <pre>
              <code>{children.trim()}</code>
            </pre>
          </div>
        ) : (
          <div
            className="shiki shiki-wrapper"
            dangerouslySetInnerHTML={{
              __html: data as string,
            }}
          />
        )}
        {isLoading && (
          <div className="flex items-center justify-center">
            <Icon name="loading" className="animate-spin" />
          </div>
        )}
      </>
    );
  }
);

export default SyntaxHighlighter;
